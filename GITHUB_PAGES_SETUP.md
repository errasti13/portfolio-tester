# 🚀 GitHub Pages Deployment Guide

## Quick Setup (Frontend Only)

### 1. Enable GitHub Pages
1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Under "Source", select **GitHub Actions**
4. The workflow in `.github/workflows/deploy.yml` will handle the rest!

### 2. Deploy
Just push your changes to the `main` branch:
```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

Your site will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

### 3. Backend Hosting Options

Since GitHub Pages only hosts static files, you'll need to deploy your backend separately:

#### Option A: Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Option B: Render
1. Go to [render.com](https://render.com)
2. Connect your GitHub repo
3. Create a new "Web Service"
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`

#### Option C: Fly.io
```bash
# Install fly CLI
# Create fly.toml in backend directory
fly launch
fly deploy
```

### 4. Update API URL
Once your backend is deployed, update the API URL in `frontend/src/services/api.ts`:

```javascript
// Replace this line in the getApiBaseUrl function:
return import.meta.env.VITE_API_URL || 'https://your-backend.railway.app/api';
```

## Full Stack Alternative: GitHub Codespaces

For development and sharing, you can use GitHub Codespaces:

1. Click the **Code** button on GitHub
2. Select **Codespaces** tab
3. Click **Create codespace on main**
4. Run your start scripts as usual
5. Codespaces will provide public URLs for your ports

## Environment Variables

Create a `.env` file in your frontend directory for production:
```
VITE_API_URL=https://your-backend-url.com/api
```

## Custom Domain (Optional)

If you have a custom domain:
1. Add a `CNAME` file to your repository root with your domain
2. Configure DNS to point to `YOUR_USERNAME.github.io`
3. Update GitHub Pages settings to use your custom domain

---

## Troubleshooting

### Build Fails
- Check that your frontend builds locally: `cd frontend && npm run build`
- Ensure all dependencies are in `package.json`

### API Calls Fail
- Your backend needs to be deployed separately
- Update the API URL in `api.ts`
- Check CORS settings on your backend

### 404 Errors
- GitHub Pages serves from the `dist` folder after build
- Make sure your routing is configured for SPA (Single Page Application) 