@echo off
title Universal Travel Itinerary Creator Launcher
echo =========================================================
echo  Universal Travel Itinerary Creator ^& Hosting Server
echo =========================================================
cd /d "%~dp0"

:: Check if Node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is NOT installed!
    echo Please install Node.js from https://nodejs.org/ before running this.
    pause
    exit /b
)

:: Check node_modules
if not exist node_modules (
    echo Installing dependencies...
    echo [INFO] Running npm install. Please wait...
    call npm install
)

echo [INFO] Starting local server on port 3000...
:: Open browser asynchronously
start "" "http://localhost:3000"
:: Start Express server
call npm start
pause
