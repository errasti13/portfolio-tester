Write-Host "🚀 Node.js Installation Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if Node.js is already installed
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js is already installed: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ You can now run: .\start-backend.ps1" -ForegroundColor Cyan
    exit 0
} catch {
    Write-Host "📦 Node.js not found. Installing..." -ForegroundColor Yellow
}

# Download Node.js LTS installer
$nodeVersion = "22.16.0"  # LTS version
$installerUrl = "https://nodejs.org/dist/v$nodeVersion/node-v$nodeVersion-x64.msi"
$installerPath = "$env:TEMP\nodejs-installer.msi"

Write-Host "📥 Downloading Node.js v$nodeVersion..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "✅ Download completed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Download failed. Please download manually from: https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Installing Node.js..." -ForegroundColor Yellow
Write-Host "   This will open the installer. Please follow the setup wizard." -ForegroundColor White
Write-Host "   IMPORTANT: Make sure to check 'Add to PATH' during installation!" -ForegroundColor Red

# Run the installer
Start-Process -FilePath $installerPath -Wait

Write-Host ""
Write-Host "✅ Installation completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Close this PowerShell window" -ForegroundColor White
Write-Host "2. Open a NEW PowerShell window" -ForegroundColor White
Write-Host "3. Navigate back to your project folder" -ForegroundColor White
Write-Host "4. Run: .\start-backend.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 