#!/usr/bin/env pwsh

Write-Host "🚀 Starting Portfolio Tester with ngrok..." -ForegroundColor Green

# Check if ngrok is installed
if (-not (Get-Command "ngrok" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ ngrok is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install ngrok from https://ngrok.com/download" -ForegroundColor Yellow
    exit 1
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
Start-Sleep -Seconds 5

Write-Host "🌍 Starting ngrok tunnels..." -ForegroundColor Magenta
ngrok start --all --config ngrok.yml

Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow

# Additional command for localtunnel
Write-Host "🌍 Starting localtunnel for frontend..." -ForegroundColor Magenta
lt --port 3000 --subdomain portfolio-frontend 