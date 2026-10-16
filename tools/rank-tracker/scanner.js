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

// Check Naver Mobile Search - 100% 팩트 기반 실질 순위 측정
async function checkNaverMobile(query) {
  const url = 'https://m.search.naver.com/search.naver?query=' + encodeURIComponent(query);
  const { status, html } = await fetchHttp(url);
  if (status !== 200 || !html) return { exposed: false, rank: null, rankDesc: '순위밖', link: '', title: '', competitorsBefore: [] };

  const ourDomain = 'xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr';
  const pos = html.indexOf(ourDomain);
  if (pos === -1 && !html.includes('전국중고오토바이매입.kr')) {
    return { exposed: false, rank: null, rankDesc: '순위밖', link: '', title: '', competitorsBefore: [] };
  }

  // Parse link
  const linkMatch = html.match(/href=["'](https?:\/\/[^"']*(?:xn--299alk823a88b8ztw1bpdu7bh3ec67a\.kr|전국중고오토바이매입\.kr)[^"']*)["']/i);
  const topLink = linkMatch ? linkMatch[1] : 'https://www.전국중고오토바이매입.kr/';

  const preHtml = html.substring(0, pos > 0 ? pos : html.length);

  // 1. Check if Place (지도) or Smartblock (인기글) appears above website section
  const hasPlaceAbove = preHtml.includes('거리순') || preHtml.includes('관련도순') || preHtml.includes('지도에서 더보기') || preHtml.includes('nmap');
  const hasSmartBlockAbove = preHtml.includes('인기글');

  // 2. Extract competitor website domains strictly appearing BEFORE our site (excluding news, video, portals)
  const NON_COMPETITOR_HOST_RE = /(?:naver\.com|pstatic\.net|navercorp\.com|youtube\.com|youtu\.be|daum\.net|kakao\.com|tistory\.com|namu\.wiki|novawiki\.app|114\.co\.kr|instagram\.com|facebook\.com|businesspost\.co\.kr|hankooki\.com|newdaily\.co\.kr|getnews\.co\.kr|cnbnews\.com|ziksir\.com|ilyosisa\.co\.kr|mdilbo\.com|vmspace\.com)/i;
  const externalDomains = [];
  const linkRe = /href=["'](https?:\/\/[^"'\s]+)["']/gi;
  let m;

  while ((m = linkRe.exec(preHtml)) !== null) {
    const rawUrl = m[1];
    // Exclude ads, news articles, and naver internal system URLs
    if (
      rawUrl.includes('naver.com') ||
      rawUrl.includes('pstatic.net') ||
      rawUrl.includes('javascript:') ||
      rawUrl.includes('ad.search.naver') ||
      rawUrl.includes('adcr.naver') ||
      rawUrl.includes('search.naver.com') ||
      rawUrl.includes('/news/') ||
      rawUrl.includes('articleView') ||
      rawUrl.includes('idxno=')
    ) continue;

    try {
      const u = new URL(rawUrl);
      const host = u.hostname.replace(/^(?:www\.|m\.)/i, '');
      if (
        host &&
        host !== ourDomain &&
        !NON_COMPETITOR_HOST_RE.test(host) &&
        !externalDomains.includes(host)
      ) {
        externalDomains.push(host);
      }
    } catch (e) {}
  }

  // Real rank = 1 + number of competitor websites ahead
  const rank = 1 + externalDomains.length;

  let rankDesc = '';
  if (rank === 1) {
    if (hasPlaceAbove) {
      rankDesc = '지도 하단 1위';
    } else if (hasSmartBlockAbove) {
      rankDesc = '인기글 하단 1위';
    } else {
      rankDesc = '파워링크 직하단 1위 (최상단)';
    }
  } else {
    rankDesc = `웹사이트 ${rank}위 (상위 ${externalDomains.length}개사 뒤)`;
  }

  return {
    exposed: true,
    rank,
    rankDesc,
    hasPlaceAbove,
    hasSmartBlockAbove,
    competitorsBefore: externalDomains,
    competitorsBeforeCount: externalDomains.length,
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
    rankDesc: naverMobile.rankDesc || (naverMobile.rank ? `${naverMobile.rank}위` : '순위밖'),
    hasPlaceAbove: naverMobile.hasPlaceAbove,
    hasSmartBlockAbove: naverMobile.hasSmartBlockAbove,
    competitorsBefore: naverMobile.competitorsBefore || [],
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
