@echo off
echo 🚀 Starting Portfolio Backend...
echo ================================

cd /d "%~dp0backend"

if exist "node_modules" (
    echo ✅ Dependencies found
) else (
    echo 📦 Installing dependencies...
    call npx --yes npm install
)

echo 🏗️ Starting server...
echo.
echo Your backend will be available at: http://localhost:5000
echo Frontend URL: https://errasti13.github.io/portfolio-tester
echo.
echo Press Ctrl+C to stop the server
echo ================================

call npx --yes npm start

pause 