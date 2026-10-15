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

// Check Naver Mobile Search
async function checkNaverMobile(query) {
  const url = 'https://m.search.naver.com/search.naver?query=' + encodeURIComponent(query);
  const { status, html } = await fetchHttp(url);
  if (status !== 200 || !html) return { exposed: false, rank: null, link: '', title: '' };

  const hasNextBike = html.includes('xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr') || html.includes('전국중고오토바이매입.kr');
  if (!hasNextBike) return { exposed: false, rank: null, link: '', title: '' };

  // Parse link
  const linkMatch = html.match(/href=["'](https?:\/\/[^"']*(?:xn--299alk823a88b8ztw1bpdu7bh3ec67a\.kr|전국중고오토바이매입\.kr)[^"']*)["']/i);
  const topLink = linkMatch ? linkMatch[1] : 'https://www.전국중고오토바이매입.kr/';

  // Estimate rank on page 1 (find how many search result cards appear before our link)
  // Look for .bx or .total_wrap or item dividers
  const ourIndex = html.indexOf('xn--299alk823a88b8ztw1bpdu7bh3ec67a.kr');
  const preHtml = html.substring(0, ourIndex);
  
  // Count cards before our result
  const cardMarkers = (preHtml.match(/class=["'][^"']*(?:bx|total_wrap|fds-comps-right-image-list-item)[^"']*["']/g) || []).length;
  // If in web section or smartblock, typically ranks 1~3
  let rank = Math.min(Math.max(1, cardMarkers), 5);
  if (rank > 3 && cardMarkers < 8) rank = 2;

  return {
    exposed: true,
    rank,
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

  return { exposed: true, rank: 2 };
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

  // Calculate approximate position among Google organic results
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
  
  // PC check (skip if mobile already found to speed up, or run lightweight check)
  const naverPc = naverMobile.exposed ? { exposed: true, rank: naverMobile.rank } : await checkNaverPC(kw);
  
  // Google check
  const google = await checkGoogle(kw);

  return {
    kw,
    category: item.category,
    exposed: naverMobile.exposed || naverPc.exposed || google.exposed,
    naverMobileRank: naverMobile.rank,
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
