const http = require('http');
const fs = require('fs');
const path = require('path');
const { scanKeyword, sleep } = require('./scanner');
const { summarizeItems, exportRow } = require('./measurement');

const PORT = 3800;
const DATA_DIR = path.join(__dirname, 'data');
const PUBLIC_DIR = path.join(__dirname, 'public');

const KEYWORDS_FILE = path.join(DATA_DIR, 'keywords.json');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

function getKeywords() {
  try {
    return JSON.parse(fs.readFileSync(KEYWORDS_FILE, 'utf8'));
  } catch (e) {
    return [];
  }
}

function saveKeywords(kws) {
  fs.writeFileSync(KEYWORDS_FILE, JSON.stringify(kws, null, 2), 'utf8');
}

function getHistory() {
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch (e) {
    return { snapshots: [] };
  }
}

function saveHistory(data) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(data, null, 2), 'utf8');
}

let isScanning = false;
let abortScan = false;

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API: Get all data
  if (pathname === '/api/data' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      keywords: getKeywords(),
      history: getHistory()
    }));
    return;
  }

  // API: Add keyword
  if (pathname === '/api/keywords' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const kws = getKeywords();
        if (payload.action === 'delete') {
          const filtered = kws.filter(k => k.kw !== payload.kw);
          saveKeywords(filtered);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, count: filtered.length }));
          return;
        }

        if (payload.kw && !kws.some(k => k.kw === payload.kw)) {
          kws.push({
            kw: payload.kw.trim(),
            category: payload.category || '기타 추가 키워드'
          });
          saveKeywords(kws);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, count: kws.length }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // API: Abort scan
  if (pathname === '/api/scan/abort' && req.method === 'POST') {
    if (isScanning) {
      abortScan = true;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
    return;
  }

  // API: Real-time scan (SSE Stream)
  if (pathname === '/api/scan' && req.method === 'GET') {
    if (isScanning) {
      res.writeHead(409, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: '이미 조회가 진행 중입니다.' }));
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    isScanning = true;
    abortScan = false;

    const keywords = getKeywords();
    const total = keywords.length;
    const scannedItems = {};
    const now = new Date();
    const todayStr = new Date(now.getTime() + 9 * 3600000).toISOString().split('T')[0];

    res.write(`data: ${JSON.stringify({ type: 'start', total, date: todayStr })}\n\n`);

    for (let i = 0; i < total; i++) {
      if (abortScan) {
        res.write(`data: ${JSON.stringify({ type: 'aborted', message: '사용자에 의해 조회가 중단되었습니다.' })}\n\n`);
        break;
      }

      const item = keywords[i];
      try {
        const scanRes = await scanKeyword(item);
        scannedItems[item.kw] = scanRes;

        res.write(`data: ${JSON.stringify({
          type: 'progress',
          current: i + 1,
          total,
          percent: Math.round(((i + 1) / total) * 100),
          item: scanRes
        })}\n\n`);
      } catch (err) {
        scannedItems[item.kw] = {
          kw: item.kw,
          category: item.category,
          exposed: null,
          status: 'request_error',
          rankDesc: '조회 실패 — 노출 여부 미확인'
        };
      }

      await sleep(250);
    }

    if (!abortScan) {
      // Save new snapshot to history
      const history = getHistory();
      const summary = summarizeItems(scannedItems, total);
      
      const newSnapshot = {
        date: todayStr,
        timestamp: new Date().toISOString(),
        label: `오늘 실시간 (${todayStr})`,
        ...summary,
        measurementMethod: 'naver_web_cards_v1',
        items: scannedItems
      };

      // Keep previous observations, including earlier runs on the same date.
      history.snapshots.unshift(newSnapshot);

      saveHistory(history);

      res.write(`data: ${JSON.stringify({
        type: 'complete',
        snapshot: newSnapshot
      })}\n\n`);
    }

    isScanning = false;
    abortScan = false;
    res.end();
    return;
  }

  // API: Export CSV
  if (pathname === '/api/export-csv') {
    const history = getHistory();
    const dateParam = parsedUrl.searchParams.get('date');
    const timestampParam = parsedUrl.searchParams.get('timestamp');
    const snapshot = (timestampParam ? history.snapshots.find(s => s.timestamp === timestampParam) : null)
      || history.snapshots.find(s => s.date === dateParam) || history.snapshots[0];

    if (!snapshot) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('스냅샷을 찾을 수 없습니다.');
      return;
    }

    const rows = [
      ['분류', '키워드', '네이버 모바일 웹문서 카드', '네이버 PC 웹문서 카드', '구글 제목 카드', '노출 상태', '노출 URL', '산정 기준', '측정 시각']
    ];

    for (const [kw, data] of Object.entries(snapshot.items)) {
      rows.push(exportRow(kw, data));
    }

    const csvContent = '\uFEFF' + rows.map(r => r.join(',')).join('\r\n');
    res.writeHead(200, {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="nextbike_rank_${snapshot.date}.csv"`
    });
    res.end(csvContent);
    return;
  }

  // Static files
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(content);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 넥스트바이크 실시간 순위 추적기 (NextBike SEO Tracker)`);
  console.log(`   웹 대시보드 주소: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
