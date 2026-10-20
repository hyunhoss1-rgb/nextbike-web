const https = require('https');

function fetchHttp(url, headers = {}) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      const req = https.get({
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9',
          'Cache-Control': 'no-cache',
          ...headers
        },
        timeout: 8000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, html: data }));
      });

      req.on('error', (err) => resolve({ status: 500, html: '', error: err.message }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ status: 408, html: '', error: 'timeout' });
      });
    } catch (e) {
      resolve({ status: 500, html: '', error: e.message });
    }
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Check Naver Mobile Search - 블로그·카페·인기글·웹사이트 전부 통합한 실제 화면 노출 순위 측정
async function checkNaverMobile(query) {
  const url = 'https://m.search.naver.com/search.naver?query=' + encodeURIComponent(query);
  const { status, html } = await fetchHttp(url);
  if (status !== 200 || !html) {
    return {
      exposed: false,
      rank: null,
      webOnlyRank: null,
      rankDesc: '순위밖',
      link: '',
      title: '',
      itemsBefore: [],
      competitorsBefore: []
    };
  }

  const ourDomain = 'xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr';

  // AI 브리핑이나 상단 <script> 이미지 JSON이 아닌 실제 본문 클릭 링크(<a href="...">)의 위치를 찾음
  const ourAnchorRe = /<a\b[^>]*href=["'](https?:\/\/[^"']*(?:xn--299alk823a88b8ztw1bpdu7bh3ec67a\.kr|전국중고오토바이매입\.kr)[^"']*)["'][^>]*>/gi;
  let anchorMatch;
  let pos = -1;
  let topLink = '';
  let inAiBriefing = false;

  while ((anchorMatch = ourAnchorRe.exec(html)) !== null) {
    const tag = anchorMatch[0];
    const matchPos = anchorMatch.index;
    // AI 브리핑 내부 출처 링크는 본문 순위에서 제외하고 별도 표기
    if (
      tag.includes('ai_briefing') ||
      tag.includes('gen_ai') ||
      tag.includes('briefing')
    ) {
      inAiBriefing = true;
      continue;
    }
    pos = matchPos;
    topLink = anchorMatch[1];
    break;
  }

  // 상단 <script> JSON (AI 브리핑 / 이미지 뷰어 데이터)에 우리 도메인이 먼저 등장했는지 확인
  const firstRawPos = html.indexOf(ourDomain);
  if (firstRawPos !== -1 && (pos === -1 || firstRawPos < pos - 5000)) {
    inAiBriefing = true;
  }

  if (pos === -1) {
    return {
      exposed: false,
      inAiBriefing,
      rank: null,
      webOnlyRank: null,
      rankDesc: inAiBriefing ? '본문 순위밖 (AI브리핑에만 인용)' : '순위밖',
      link: '',
      title: '',
      itemsBefore: [],
      competitorsBefore: []
    };
  }

  const preHtml = html.substring(0, pos);

  // 플레이스(지도) 블록이 상단에 있는지 확인
  const hasPlaceAbove =
    preHtml.includes('거리순') ||
    preHtml.includes('지도에서 더보기') ||
    preHtml.includes('place.naver.com');

  // 우리 홈페이지 위에 노출된 모든 실제 검색 결과물(블로그, 카페, 인플루언서, 지식iN, 티스토리, 타사 홈페이지 등)을 순서대로 추출
  const aRe = /<a\b[^>]*href=["'](https?:\/\/[^"'\s]+)["'][^>]*>/gi;
  let m;
  const itemsBefore = [];
  const webCompetitors = [];
  const seenKeys = new Set();

  while ((m = aRe.exec(preHtml)) !== null) {
    const rawUrl = m[1];
    if (
      rawUrl.includes('ad.search.naver') ||
      rawUrl.includes('adcr.naver') ||
      rawUrl.includes('search.naver.com') ||
      rawUrl.includes('nid.naver.com') ||
      rawUrl.includes('help.naver.com') ||
      rawUrl.includes('policy.naver.com') ||
      rawUrl.includes('map.naver.com') ||
      rawUrl.includes('place.naver.com') ||
      rawUrl.includes('booking.naver.com') ||
      rawUrl.includes('talk.naver.com') ||
      rawUrl.includes('keep.naver.com') ||
      rawUrl.includes('pstatic.net') ||
      rawUrl.includes('navercorp.com') ||
      rawUrl.includes('javascript:')
    ) {
      continue;
    }

    try {
      const u = new URL(rawUrl);
      const host = u.hostname.replace(/^(?:www\.|m\.)/i, '');
      if (!host || host === ourDomain || host === '전국중고오토바이매입.kr') continue;

      // 1. 네이버 블로그 게시물 (blog.naver.com/{blogId}/{logNo})
      if (host === 'blog.naver.com') {
        const parts = u.pathname.split('/').filter(Boolean);
        if (parts.length < 2) continue; // 블로그 프로필 링크 제외, 실제 글만 카운트
        const key = `블로그(${parts[0]})`;
        const uniquePost = `blog:${parts[0]}/${parts[1]}`;
        if (!seenKeys.has(uniquePost)) {
          seenKeys.add(uniquePost);
          itemsBefore.push(key);
        }
        continue;
      }

      // 2. 네이버 카페 게시물 (cafe.naver.com/{cafeId}/{articleId})
      if (host === 'cafe.naver.com') {
        const parts = u.pathname.split('/').filter(Boolean);
        if (parts.length < 2 && !u.search.includes('articleid')) continue;
        const key = `카페(${parts[0]})`;
        const uniquePost = `cafe:${parts.join('/')}${u.search}`;
        if (!seenKeys.has(uniquePost)) {
          seenKeys.add(uniquePost);
          itemsBefore.push(key);
        }
        continue;
      }

      // 3. 네이버 인플루언서 콘텐츠 (in.naver.com/{id}/contents/...)
      if (host === 'in.naver.com') {
        if (!u.pathname.includes('/contents/')) continue;
        const parts = u.pathname.split('/').filter(Boolean);
        const key = `인플루언서(${parts[0]})`;
        const uniquePost = `in:${u.pathname}`;
        if (!seenKeys.has(uniquePost)) {
          seenKeys.add(uniquePost);
          itemsBefore.push(key);
        }
        continue;
      }

      // 4. 네이버 지식iN (kin.naver.com/qna/detail...)
      if (host === 'kin.naver.com') {
        const docId = u.searchParams.get('docId');
        if (!docId) continue;
        const uniquePost = `kin:${docId}`;
        if (!seenKeys.has(uniquePost)) {
          seenKeys.add(uniquePost);
          itemsBefore.push(`지식iN(${docId})`);
        }
        continue;
      }

      // 5. 네이버 뉴스 기사 (n.news.naver.com)
      if (host === 'n.news.naver.com' || host === 'news.naver.com') {
        if (!u.pathname.includes('/article/')) continue;
        const uniquePost = `news:${u.pathname}`;
        if (!seenKeys.has(uniquePost)) {
          seenKeys.add(uniquePost);
          itemsBefore.push('네이버뉴스');
        }
        continue;
      }

      // 기타 네이버 시스템 도메인 제외
      if (host.endsWith('naver.com')) continue;

      // 6. 티스토리 블로그
      if (host === 'tistory.com' || host.endsWith('.tistory.com')) {
        const uniquePost = `tistory:${host}${u.pathname}`;
        if (!seenKeys.has(uniquePost)) {
          seenKeys.add(uniquePost);
          itemsBefore.push(`티스토리(${host.replace('.tistory.com', '')})`);
        }
        continue;
      }

      // 7. 유튜브 영상
      if (host === 'youtube.com' || host === 'youtu.be') {
        const v = u.searchParams.get('v') || u.pathname;
        const uniquePost = `yt:${v}`;
        if (!seenKeys.has(uniquePost)) {
          seenKeys.add(uniquePost);
          itemsBefore.push('유튜브영상');
        }
        continue;
      }

      // 8. 일반 외부 웹사이트 / 경쟁사 홈페이지 (도메인 단위 1회 카운트)
      const uniqueSite = `web:${host}`;
      if (!seenKeys.has(uniqueSite)) {
        seenKeys.add(uniqueSite);
        itemsBefore.push(host);
        webCompetitors.push(host);
      }
    } catch (e) {}
  }

  // 진짜 통합 순위 = 1 + 우리 위에 있는 모든(블로그+카페+인기글+웹사이트) 개수
  const rank = 1 + itemsBefore.length;
  const webOnlyRank = 1 + webCompetitors.length;
  const blogOrCafeCount = itemsBefore.length - webCompetitors.length;
  const hasSmartBlockAbove = blogOrCafeCount > 0;

  let rankDesc = '';
  if (rank === 1) {
    if (hasPlaceAbove) {
      rankDesc = '플레이스 직하단 통합 1위 (최상단)';
    } else {
      rankDesc = '파워링크 직하단 통합 1위 (최상단)';
    }
  } else {
    const parts = [];
    if (webCompetitors.length > 0) parts.push(`타사홈페이지 ${webCompetitors.length}개`);
    if (blogOrCafeCount > 0) parts.push(`블로그·인기글 ${blogOrCafeCount}개`);
    rankDesc = `통합 ${rank}위 (앞: ${parts.join(' + ')})`;
  }

  if (inAiBriefing) {
    rankDesc += ' [AI브리핑 상단인용]';
  }

  // 우측 작은 썸네일 이미지(w.simg 등) 노출 여부 확인
  const nlogRe = /<a\b[^>]*href=["'](https?:\/\/[^"']*xn--299alk823a88b8ztw1bpdu7bh3ec67a\.kr[^"']*)["'][^>]*data-nlog-area=["']([^"']+)["'][^>]*>/gi;
  let nm;
  const nlogAreas = [];
  while ((nm = nlogRe.exec(html)) !== null) {
    nlogAreas.push(nm[2]);
  }
  const hasThumb =
    nlogAreas.some((a) => a.includes('simg') || a.includes('mimg') || a.includes('img') || a.includes('thumb')) ||
    nlogAreas.length >= 3;

  return {
    exposed: true,
    inAiBriefing,
    hasThumb,
    rank,
    webOnlyRank,
    blogOrCafeCount,
    rankDesc,
    hasPlaceAbove,
    hasSmartBlockAbove,
    competitorsBefore: itemsBefore,
    webCompetitorsBefore: webCompetitors,
    competitorsBeforeCount: itemsBefore.length,
    link: topLink,
    title: `전국중고오토바이매입.kr`
  };
}

// Check Naver PC Search
async function checkNaverPC(query) {
  const url = 'https://search.naver.com/search.naver?where=nexearch&query=' + encodeURIComponent(query);
  const { status, html } = await fetchHttp(url, {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  if (status !== 200 || !html) return { exposed: false, rank: null };

  const hasNextBike = html.includes('xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr') || html.includes('전국중고오토바이매입.kr');
  if (!hasNextBike) return { exposed: false, rank: null };

  const pos = html.indexOf('xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr');
  const preHtml = html.substring(0, pos);
  const NON_COMPETITOR_HOST_RE = /(?:naver\.com|pstatic\.net|navercorp\.com|youtube\.com|youtu\.be|daum\.net|kakao\.com|tistory\.com|namu\.wiki|novawiki\.app|114\.co\.kr|instagram\.com|facebook\.com|businesspost\.co\.kr|hankooki\.com|newdaily\.co\.kr|getnews\.co\.kr|cnbnews\.com|ziksir\.com|ilyosisa\.co\.kr|mdilbo\.com|vmspace\.com)/i;
  const externalDomains = [];
  const linkRe = /href=["'](https?:\/\/[^"'\s]+)["']/gi;
  let m;
  while ((m = linkRe.exec(preHtml)) !== null) {
    const rawUrl = m[1];
    if (
      rawUrl.includes('naver.com') ||
      rawUrl.includes('pstatic.net') ||
      rawUrl.includes('ad.') ||
      rawUrl.includes('adcr.') ||
      rawUrl.includes('/news/') ||
      rawUrl.includes('articleView') ||
      rawUrl.includes('idxno=')
    ) continue;
    try {
      const host = new URL(rawUrl).hostname.replace(/^(?:www\.|m\.)/i, '');
      if (host && !NON_COMPETITOR_HOST_RE.test(host) && !externalDomains.includes(host)) {
        externalDomains.push(host);
      }
    } catch(e) {}
  }

  const rank = 1 + externalDomains.length;
  return { exposed: true, rank: Math.min(rank, 10) };
}

// Check Google Search
async function checkGoogle(query) {
  const url = 'https://www.google.co.kr/search?q=' + encodeURIComponent(query) + '&hl=ko&gl=kr&num=20';
  const { status, html } = await fetchHttp(url, {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  if (status !== 200 || !html) return { exposed: false, rank: null };

  const hasNextBike = html.includes('xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr') || html.includes('전국중고오토바이매입.kr');
  if (!hasNextBike) return { exposed: false, rank: null };

  const pos = html.indexOf('xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr');
  const preHtml = html.substring(0, pos);
  const googleCards = (preHtml.match(/<div class=["'][^"']*(?:yuRUbf|MjjYud|g)[^"']*["']/g) || []).length;
  const rank = Math.min(Math.max(1, googleCards), 10);

  return { exposed: true, rank };
}

// Single Keyword Full Inspection
async function scanKeyword(item) {
  const kw = item.kw;
  const naverMobile = await checkNaverMobile(kw);
  await sleep(150);
  
  const naverPc = await checkNaverPC(kw);
  const google = await checkGoogle(kw);

  return {
    kw,
    category: item.category,
    exposed: naverMobile.exposed,
    naverMobileRank: naverMobile.rank,
    webOnlyRank: naverMobile.webOnlyRank || null,
    blogOrCafeCount: naverMobile.blogOrCafeCount || 0,
    rankDesc: naverMobile.rankDesc || (naverMobile.rank ? `${naverMobile.rank}위` : '순위밖'),
    hasPlaceAbove: naverMobile.hasPlaceAbove,
    hasSmartBlockAbove: naverMobile.hasSmartBlockAbove,
    competitorsBefore: naverMobile.competitorsBefore || [],
    webCompetitorsBefore: naverMobile.webCompetitorsBefore || [],
    naverPcRank: naverPc.rank,
    googleRank: google.rank,
    link: naverMobile.link,
    title: naverMobile.title
  };
}

module.exports = {
  scanKeyword,
  checkNaverMobile,
  checkGoogle,
  sleep
};
