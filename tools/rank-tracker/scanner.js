const https = require('https');
const { parseNaverResults, parseGoogleResults, unknownResult } = require('./result-parser');

function fetchHttp(url, headers = {}) {
  return new Promise((resolve) => {
    try {
      const req = https.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'ko-KR,ko;q=0.9',
          ...headers,
        },
        timeout: 10000,
      }, (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, html: data }));
        res.on('error', () => resolve({ status: 0, html: '', error: 'response_error' }));
      });
      req.on('error', () => resolve({ status: 0, html: '', error: 'connection_error' }));
      req.on('timeout', () => { req.destroy(); resolve({ status: 0, html: '', error: 'timeout' }); });
    } catch {
      resolve({ status: 0, html: '', error: 'request_error' });
    }
  });
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function readResult(response, parser) {
  if (response.status !== 200 || !response.html) {
    return { ...unknownResult('request_error', '조회 실패 — 노출 여부 미확인'), httpStatus: response.status };
  }
  return parser(response.html);
}

async function checkNaverMobile(query) {
  return readResult(await fetchHttp('https://m.search.naver.com/search.naver?query=' + encodeURIComponent(query)), parseNaverResults);
}

async function checkNaverPC(query) {
  const response = await fetchHttp('https://search.naver.com/search.naver?where=nexearch&query=' + encodeURIComponent(query), {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  });
  return readResult(response, parseNaverResults);
}

async function checkGoogle(query) {
  const response = await fetchHttp('https://www.google.co.kr/search?q=' + encodeURIComponent(query) + '&hl=ko&gl=kr', {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  });
  return readResult(response, parseGoogleResults);
}

async function scanKeyword(item) {
  const mobile = await checkNaverMobile(item.kw);
  await sleep(150);
  const pc = await checkNaverPC(item.kw);
  const google = await checkGoogle(item.kw);
  return {
    kw: item.kw,
    category: item.category,
    exposed: mobile.exposed,
    status: mobile.status,
    measurementMethod: 'naver_web_cards_v1',
    measuredAt: new Date().toISOString(),
    naverMobileRank: mobile.webOnlyRank,
    webOnlyRank: mobile.webOnlyRank,
    parsedOrganicCardRank: mobile.rank,
    rankDesc: mobile.rankDesc,
    competitorsBefore: mobile.competitorsBefore || [],
    webCompetitorsBefore: mobile.webCompetitorsBefore || [],
    naverPcRank: pc.webOnlyRank,
    naverPcStatus: pc.status,
    googleRank: google.rank,
    googleStatus: google.status,
    link: mobile.link || '',
    title: mobile.title || '',
    parsedWebCards: mobile.parsedWebCards || 0,
    naverPcParsedWebCards: pc.parsedWebCards || 0,
  };
}

module.exports = { scanKeyword, checkNaverMobile, checkNaverPC, checkGoogle, fetchHttp, readResult, sleep };
