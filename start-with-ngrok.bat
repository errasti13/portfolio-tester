@echo off
echo 🚀 Starting Portfolio Tester with ngrok...

REM Check if ngrok is installed
ngrok version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ngrok is not installed or not in PATH
    echo Please install ngrok from https://ngrok.com/download
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm run install:all
)

echo 🔧 Starting backend server...
start "Backend Server" /min cmd /c "npm run dev:backend"

echo ⚛️ Starting frontend server...
start "Frontend Server" /min cmd /c "npm run dev:frontend"

echo ⏳ Waiting for servers to initialize...
timeout /t 5 /nobreak >nul

echo 🌍 Starting ngrok tunnels...
ngrok start --all --config ngrok.yml

echo ✅ All services started!
echo Press Ctrl+C to stop ngrok (servers will continue running in background)
pause 