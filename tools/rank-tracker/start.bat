@echo off
chcp 65001 > nul
title 넥스트바이크 실시간 순위 추적기
echo ========================================================
echo   🚀 넥스트바이크 실시간 SEO 순위 & 히스토리 추적기
echo ========================================================
echo.
echo   [1/2] 실시간 대시보드 서버를 구동 중입니다...
cd /d "%~dp0"
timeout /t 1 /nobreak > nul
start "" http://localhost:3800
node server.js
pause
