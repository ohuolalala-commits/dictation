@echo off
chcp 65001 >nul 2>&1
title English Dictation

echo.
echo    English Dictation - Starting...

cd /d "%~dp0backend"
start "Backend" /MIN python -m uvicorn main:app --host 127.0.0.1 --port 8000

timeout /t 4 /nobreak >nul

start "" "%~dp0index.html"
start "" "%~dp0teacher.html"

echo    Done!
timeout /t 2 /nobreak >nul
exit
