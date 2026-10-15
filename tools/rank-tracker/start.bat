@echo off
chcp 65001 > nul
title 넥스트바이크 실시간 순위 추적기
echo ========================================================
echo   🚀 넥스트바이크 실시간 SEO 순위 & 히스토리 추적기
echo ========================================================
echo.
echo   [1/2] 크롬 브라우저로 실시간 대시보드를 실행합니다...
cd /d "%~dp0"

timeout /t 1 /nobreak > nul

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "http://localhost:3800"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "http://localhost:3800"
) else if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    start "" "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" "http://localhost:3800"
) else (
    start chrome "http://localhost:3800" 2>nul || start "" "http://localhost:3800"
)

echo   [2/2] 대시보드 서버 가동 중... (이 창을 닫으면 프로그램이 종료됩니다)
echo.
node server.js
pause
