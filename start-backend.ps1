Write-Host "🚀 Starting Portfolio Backend..." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Change to backend directory
Set-Location -Path "$PSScriptRoot\backend"

# Check if Node.js is available
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Please install Node.js from https://nodejs.org" -ForegroundColor Red
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Check if dependencies are installed
if (Test-Path "node_modules") {
    Write-Host "✅ Dependencies found" -ForegroundColor Green
} else {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    try {
        npm install
        Write-Host "✅ Dependencies installed!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install dependencies. Trying with npx..." -ForegroundColor Yellow
        npx --yes npm install
    }
}

Write-Host ""
Write-Host "🏗️ Starting server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Your backend will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend URL: https://errasti13.github.io/portfolio-tester" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor White
Write-Host "================================" -ForegroundColor Green

try {
    npm start
} catch {
    Write-Host "❌ npm not found, trying with npx..." -ForegroundColor Yellow
    npx --yes npm start
} 