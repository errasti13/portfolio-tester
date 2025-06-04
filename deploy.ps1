Write-Host "🚀 Portfolio Free Hosting Setup" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if Railway CLI is installed
if (!(Get-Command "railway" -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

# Get user's GitHub username
Write-Host ""
$GITHUB_USERNAME = Read-Host "Enter your GitHub username"

if ([string]::IsNullOrWhiteSpace($GITHUB_USERNAME)) {
    Write-Host "❌ GitHub username is required!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 Updating CORS configuration with your GitHub username..." -ForegroundColor Yellow

# Update CORS configuration in backend
$backendFile = "backend/src/index.mjs"
$content = Get-Content $backendFile -Raw
$updatedContent = $content -replace "YOUR_USERNAME", $GITHUB_USERNAME
Set-Content $backendFile $updatedContent

Write-Host "✅ CORS configuration updated!" -ForegroundColor Green

Write-Host ""
Write-Host "🏗️  Building frontend to check for errors..." -ForegroundColor Yellow
Set-Location frontend
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend build failed. Please fix errors before deploying." -ForegroundColor Red
    exit 1
}

Set-Location ..

Write-Host ""
Write-Host "🚀 Ready to deploy!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Deploy backend to Railway:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   railway login" -ForegroundColor Gray
Write-Host "   railway init" -ForegroundColor Gray
Write-Host "   railway up" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Get your Railway URL and update:" -ForegroundColor White
Write-Host "   - frontend/src/services/api.ts" -ForegroundColor Gray
Write-Host "   - .github/workflows/deploy.yml" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Commit and push to GitHub:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Setup free hosting deployment'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Enable GitHub Pages in your repository settings" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan 