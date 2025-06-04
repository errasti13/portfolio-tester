@echo off
echo 🚀 Starting Portfolio Tester with Localtunnel...

echo 🔧 Starting backend server...
start "Backend Server" /min cmd /c "npm run dev:backend"

echo ⚛️ Starting frontend server...
start "Frontend Server" /min cmd /c "npm run dev:frontend"

echo ⏳ Waiting for servers to initialize...
timeout /t 8 /nobreak >nul

echo 🌍 Creating tunnels with Localtunnel...
echo.
echo Frontend tunnel:
start "Frontend Tunnel" cmd /c "lt --port 3000 --subdomain portfolio-frontend"

timeout /t 2 /nobreak >nul

echo Backend tunnel:
start "Backend Tunnel" cmd /c "lt --port 5000 --subdomain portfolio-api"

echo.
echo ✅ All services started!
echo Your app should be available at:
echo Frontend: https://portfolio-frontend.loca.lt
echo Backend API: https://portfolio-api.loca.lt
echo.
pause 