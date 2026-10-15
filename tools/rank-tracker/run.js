const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

const PORT = 3800;

function isPortInUse(port) {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', (err) => {
        if (err.code === 'EADDRINUSE') resolve(true);
        else resolve(false);
      })
      .once('listening', () => {
        tester.once('close', () => resolve(false)).close();
      })
      .listen(port);
  });
}

function launchChrome() {
  const url = `http://localhost:${PORT}`;
  const chromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    (process.env.LOCALAPPDATA || '') + '\\Google\\Chrome\\Application\\chrome.exe'
  ];

  for (const cp of chromePaths) {
    if (fs.existsSync(cp)) {
      try {
        spawn(cp, [url], { detached: true, stdio: 'ignore' }).unref();
        console.log(`\n[Chrome] 구글 크롬으로 대시보드를 열었습니다: ${url}`);
        return;
      } catch (e) {}
    }
  }

  // Fallback to default start
  exec(`start "" "${url}"`);
}

async function main() {
  console.log('='.repeat(60));
  console.log('   🚀 넥스트바이크 실시간 SEO 순위 & 히스토리 추적기');
  console.log(`   웹 대시보드 주소: http://localhost:${PORT}`);
  console.log('='.repeat(60));

  setTimeout(launchChrome, 800);

  const inUse = await isPortInUse(PORT);
  if (inUse) {
    console.log(`\n[INFO] 서버가 이미 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`[INFO] 구글 크롬 창(http://localhost:${PORT})을 새로 띄웠습니다.`);
    console.log('대시보드를 이용하신 후 이 창을 닫으시면 됩니다.\n');
  } else {
    // Start server
    require('./server.js');
  }
}

main();
