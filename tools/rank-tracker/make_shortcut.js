const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const psScript = `
$ws = New-Object -ComObject WScript.Shell
$desktop = [Environment]::GetFolderPath('Desktop')

$lnkPath = Join-Path $desktop "넥스트바이크 실시간 순위조회.lnk"
if (Test-Path $lnkPath) { Remove-Item $lnkPath -Force }

$sc = $ws.CreateShortcut($lnkPath)
$sc.TargetPath = "C:\\Users\\A\\.gemini\\antigravity\\scratch\\nextbike-web\\tools\\rank-tracker\\start.bat"
$sc.WorkingDirectory = "C:\\Users\\A\\.gemini\\antigravity\\scratch\\nextbike-web\\tools\\rank-tracker"
$sc.IconLocation = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe,0"
$sc.Description = "넥스트바이크 실시간 SEO 순위 & 히스토리 추적기"
$sc.Save()

Write-Host "SUCCESS: Created desktop shortcut at: $lnkPath"
`;

const tempFile = path.join(__dirname, 'temp_create_sc.ps1');
fs.writeFileSync(tempFile, '\uFEFF' + psScript, 'utf8');

try {
  execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${tempFile}"`, { stdio: 'inherit' });
} catch (e) {
  console.error('Error creating shortcut:', e.message);
} finally {
  if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
}
