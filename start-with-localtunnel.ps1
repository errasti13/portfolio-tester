#!/usr/bin/env pwsh

Write-Host "🚀 Starting Portfolio Tester with Localtunnel..." -ForegroundColor Green

# Check if localtunnel is installed
if (-not (Get-Command "lt" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ localtunnel is not installed" -ForegroundColor Red
    Write-Host "Installing localtunnel..." -ForegroundColor Yellow
    npm install -g localtunnel
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm run install:all
}

Write-Host "🔧 Starting backend server..." -ForegroundColor Cyan
Start-Process -FilePath "npm" -ArgumentList "run", "dev:backend" -WindowStyle Minimized

Write-Host "⚛️  Starting frontend server..." -ForegroundColor Cyan
Start-Process -FilePath "npm" -ArgumentList "run", "dev:frontend" -WindowStyle Minimized

# Wait a moment for servers to start
Write-Host "⏳ Waiting for servers to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

Write-Host "🌍 Creating tunnels with Localtunnel..." -ForegroundColor Magenta
Write-Host ""
Write-Host "Frontend URL:" -ForegroundColor Green
Start-Process -FilePath "lt" -ArgumentList "--port", "3000", "--subdomain", "portfolio-frontend" -WindowStyle Normal
Start-Sleep -Seconds 2

Write-Host "Backend API URL:" -ForegroundColor Green  
Start-Process -FilePath "lt" -ArgumentList "--port", "5000", "--subdomain", "portfolio-api" -WindowStyle Normal

Write-Host ""
Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host "Your app should be available at:" -ForegroundColor Yellow
Write-Host "Frontend: https://portfolio-frontend.loca.lt" -ForegroundColor Cyan
Write-Host "Backend API: https://portfolio-api.loca.lt" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Yellow
Read-Host 