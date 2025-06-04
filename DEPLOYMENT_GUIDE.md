# 🚀 Free Hosting Deployment Guide

This guide will help you deploy your portfolio project completely **FREE** using GitHub Pages for the frontend and Railway for the backend.

## 🎯 Overview

- **Frontend**: GitHub Pages (Free, unlimited public repos)
- **Backend**: Railway (Free tier: 500 hours/month, $5 credit monthly)
- **Total Cost**: $0 for most use cases

## 📋 Prerequisites

1. GitHub account
2. Railway account (sign up at [railway.app](https://railway.app))
3. Git installed on your computer

## 🎨 Frontend Deployment (GitHub Pages)

### Step 1: Enable GitHub Actions
Your repository already has the GitHub Actions workflow configured. Just need to enable it:

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under "Source", select **GitHub Actions**
4. That's it! The workflow will trigger automatically.

### Step 2: Update Your GitHub Username
Update the CORS configuration in the backend to include your GitHub username:

1. Open `backend/src/index.mjs`
2. Find this line: `'https://YOUR_USERNAME.github.io', // Replace with your GitHub username`
3. Replace `YOUR_USERNAME` with your actual GitHub username

### Step 3: Deploy
```bash
git add .
git commit -m "Setup free hosting deployment"
git push origin main
```

Your frontend will be available at: `https://YOUR_USERNAME.github.io/portfolio-tester`

## 🚀 Backend Deployment (Railway)

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```

### Step 3: Deploy Backend
```bash
cd backend
railway init
# Follow the prompts - choose "Deploy from existing repo"
railway up
```

### Step 4: Get Your Backend URL
After deployment, Railway will give you a URL like:
`https://portfolio-backend-production.up.railway.app`

### Step 5: Update Frontend API Configuration
Update the API URL in two places:

1. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
   - Replace `https://portfolio-backend-production.up.railway.app/api` with your actual Railway URL

2. **Frontend API Service** (`frontend/src/services/api.ts`):
   - Replace `https://portfolio-backend-production.up.railway.app/api` with your actual Railway URL

### Step 6: Redeploy Frontend
```bash
git add .
git commit -m "Update API URL with Railway deployment"
git push origin main
```

## 🔧 Alternative Free Backend Options

If Railway doesn't work for you, here are other free options:

### Option A: Render
1. Go to [render.com](https://render.com)
2. Connect your GitHub repo
3. Create a new "Web Service"
4. Set Root Directory: `backend`
5. Set Build Command: `npm install`
6. Set Start Command: `npm start`

### Option B: Fly.io
```bash
# Install fly CLI
curl -L https://fly.io/install.sh | sh

cd backend
fly launch
fly deploy
```

### Option C: Cyclic (Now Stormkit)
1. Go to [stormkit.io](https://stormkit.io)
2. Connect GitHub repo
3. Deploy backend folder

## 🌐 Environment Variables

For production, you can set environment variables:

### Railway:
```bash
railway variables set VITE_API_URL=https://your-backend-url.railway.app/api
```

### GitHub Pages:
Create `.env.production` in the frontend folder:
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

## 🔍 Testing Your Deployment

### Test Backend:
Visit: `https://your-backend-url.railway.app/api/assets`
Should return JSON with asset data.

### Test Frontend:
Visit: `https://YOUR_USERNAME.github.io/portfolio-tester`
Should load your portfolio application.

## 🐛 Troubleshooting

### Frontend Issues:
- **404 Error**: Check that GitHub Pages is enabled and workflow completed
- **Blank Page**: Check browser console for errors
- **API Errors**: Verify backend URL is correct

### Backend Issues:
- **500 Error**: Check Railway logs: `railway logs`
- **CORS Errors**: Verify your frontend URL is in the CORS configuration
- **Data Issues**: Ensure `data/` folder is included in deployment

### Common Fixes:
```bash
# Check build locally
cd frontend && npm run build

# Check backend locally
cd backend && npm start

# Check Railway deployment
railway status
railway logs
```

## 💰 Cost Breakdown

### GitHub Pages:
- **Cost**: FREE
- **Limits**: 100GB bandwidth/month, 1GB storage
- **Perfect for**: Static sites, SPAs

### Railway:
- **Cost**: FREE
- **Limits**: 500 hours/month, $5 credit monthly
- **Perfect for**: Small to medium APIs

### Total Monthly Cost: $0
Your portfolio should stay well within the free limits for personal use and portfolio showcasing.

## 🚀 Advanced: Custom Domain (Optional)

If you have a custom domain:

1. **Add CNAME file to repository root**:
   ```
   yourdomain.com
   ```

2. **Configure DNS**: Point your domain to `YOUR_USERNAME.github.io`

3. **Update CORS**: Add your domain to the backend CORS configuration

## 📱 Mobile & Performance

Your deployment will be:
- ✅ Mobile responsive
- ✅ HTTPS enabled
- ✅ CDN cached (GitHub Pages)
- ✅ Serverless backend (Railway)

## 🎉 You're Done!

After following this guide, you'll have:
- A professional portfolio hosted for free
- Automatic deployments on code changes
- Global CDN distribution
- HTTPS security
- Professional URLs

Share your portfolio with confidence! 🚀 