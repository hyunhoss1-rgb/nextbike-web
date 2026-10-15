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

// Check Naver Mobile Search - 실질 순위 (파워링크 광고 제외, 파워링크 바로 밑 = 1위)
async function checkNaverMobile(query) {
  const url = 'https://m.search.naver.com/search.naver?query=' + encodeURIComponent(query);
  const { status, html } = await fetchHttp(url);
  if (status !== 200 || !html) return { exposed: false, rank: null, rankDesc: '순위밖', link: '', title: '' };

  const ourDomain = 'xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr';
  const pos = html.indexOf(ourDomain);
  if (pos === -1 && !html.includes('전국중고오토바이매입.kr')) {
    return { exposed: false, rank: null, rankDesc: '순위밖', link: '', title: '' };
  }

  // Parse link
  const linkMatch = html.match(/href=["'](https?:\/\/[^"']*(?:xn--299alk823a88b8ztw1bpdu7bh3ec67a\.kr|전국중고오토바이매입\.kr)[^"']*)["']/i);
  const topLink = linkMatch ? linkMatch[1] : 'https://www.전국중고오토바이매입.kr/';

  // Extract all organic competitor domains before our site
  const preHtml = html.substring(0, pos > 0 ? pos : html.length);
  const externalDomains = [];
  const linkRe = /href=["'](https?:\/\/[^"'\s]+)["']/gi;
  let m;

  while ((m = linkRe.exec(preHtml)) !== null) {
    const rawUrl = m[1];
    // Exclude ads and naver internal system URLs
    if (
      rawUrl.includes('naver.com') ||
      rawUrl.includes('pstatic.net') ||
      rawUrl.includes('javascript:') ||
      rawUrl.includes('ad.search.naver') ||
      rawUrl.includes('adcr.naver') ||
      rawUrl.includes('search.naver.com')
    ) continue;

    try {
      const u = new URL(rawUrl);
      const host = u.hostname.replace('www.', '');
      if (host && host !== ourDomain && !externalDomains.includes(host)) {
        externalDomains.push(host);
      }
    } catch (e) {}
  }

  // 실질 순위 = 1 (파워링크 바로 밑) + 앞선 유기적 경쟁 사이트 수
  const rank = 1 + externalDomains.length;

  let rankDesc = `${rank}위`;
  if (rank === 1) {
    rankDesc = '파워링크 직하단 1위 (최상단)';
  } else if (rank <= 3) {
    rankDesc = `최상단 골드존 ${rank}위`;
  } else {
    rankDesc = `1페이지 ${rank}위`;
  }

  return {
    exposed: true,
    rank,
    rankDesc,
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
  const externalDomains = [];
  const linkRe = /href=["'](https?:\/\/[^"'\s]+)["']/gi;
  let m;
  while ((m = linkRe.exec(preHtml)) !== null) {
    const rawUrl = m[1];
    if (rawUrl.includes('naver.com') || rawUrl.includes('pstatic.net') || rawUrl.includes('ad.') || rawUrl.includes('adcr.')) continue;
    try {
      const host = new URL(rawUrl).hostname.replace('www.', '');
      if (host && !externalDomains.includes(host)) externalDomains.push(host);
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
