#!/bin/bash

echo "🚀 Portfolio Free Hosting Setup"
echo "================================"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Get user's GitHub username
echo ""
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required!"
    exit 1
fi

echo ""
echo "🔧 Updating CORS configuration with your GitHub username..."

# Update CORS configuration in backend
sed -i "s/YOUR_USERNAME/$GITHUB_USERNAME/g" backend/src/index.mjs

echo "✅ CORS configuration updated!"

echo ""
echo "🏗️  Building frontend to check for errors..."
cd frontend
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed. Please fix errors before deploying."
    exit 1
fi

cd ..

echo ""
echo "🚀 Ready to deploy!"
echo ""
echo "Next steps:"
echo "1. Deploy backend to Railway:"
echo "   cd backend"
echo "   railway login"
echo "   railway init"
echo "   railway up"
echo ""
echo "2. Get your Railway URL and update:"
echo "   - frontend/src/services/api.ts"
echo "   - .github/workflows/deploy.yml"
echo ""
echo "3. Commit and push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Setup free hosting deployment'"
echo "   git push origin main"
echo ""
echo "4. Enable GitHub Pages in your repository settings"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md" 