# 🏠 Local Backend + GitHub Pages Frontend Setup

Perfect for development! Your frontend will be hosted on GitHub Pages (available to everyone), but the backend runs on your local computer (only when you're online).

## 🎯 How It Works

- **Frontend**: `https://errasti13.github.io/portfolio-tester` (GitHub Pages - always available)
- **Backend**: `http://localhost:5000` (Your computer - only when running)
- **Cost**: 100% FREE! 💰

## 🚀 Quick Setup Steps

### 1. Enable GitHub Pages (One-time setup)

1. Go to your GitHub repository: `https://github.com/errasti13/portfolio-tester`
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under "Source", select **GitHub Actions**
5. Save the settings

Your GitHub Actions workflow will automatically build and deploy your frontend!

### 2. Check Your Deployment

Visit: `https://errasti13.github.io/portfolio-tester`

You should see your portfolio website, but it will show an error message about the backend not being available (that's normal!).

### 3. Start Your Local Backend

Every time you want to use the portfolio:

```bash
cd backend
npm start
```

You should see:
```
Server running on port 5000
```

### 4. Use Your Portfolio

Now visit: `https://errasti13.github.io/portfolio-tester`

Your portfolio will work perfectly! 🎉

## 📱 Usage Instructions

### To Use Your Portfolio:
1. Start your backend: `cd backend && npm start`
2. Visit: `https://errasti13.github.io/portfolio-tester`
3. Share the URL with anyone!

### To Stop:
- Press `Ctrl+C` in the terminal where the backend is running
- The frontend will still be visible but won't load data

## ✅ Advantages of This Setup

- **Free**: No hosting costs
- **Fast**: Frontend cached by GitHub's CDN
- **Secure**: HTTPS enabled
- **Professional**: Real domain name
- **Private**: Backend data never leaves your computer
- **Flexible**: Easy to modify and test

## 🐛 Troubleshooting

### "Backend not running!" error
- Make sure you ran `cd backend && npm start`
- Check if you see "Server running on port 5000"

### GitHub Pages shows 404
- Wait 5-10 minutes after enabling GitHub Pages
- Check GitHub Actions tab for build status
- Make sure you enabled Pages with "GitHub Actions" source

### CORS errors
- Your backend is already configured for GitHub Pages
- Make sure you're using `https://errasti13.github.io/portfolio-tester` (not localhost)

## 🔄 Making Changes

### Frontend Changes:
1. Edit files in `frontend/` folder
2. Commit and push to GitHub
3. GitHub Actions will automatically rebuild

### Backend Changes:
1. Edit files in `backend/` folder
2. Restart your local backend: `Ctrl+C` then `npm start`

## 🌟 Pro Tips

- Keep the backend terminal open while using the portfolio
- Bookmark `https://errasti13.github.io/portfolio-tester` for easy access
- The backend uses very little CPU/memory
- You can run multiple backend instances on different ports if needed

## 🎯 Perfect For:

- **Portfolio showcasing**: Share the GitHub Pages URL
- **Development**: Test changes quickly
- **Demos**: Professional URL with local data control
- **Learning**: Understand client-server architecture

---

**Your portfolio URL:** `https://errasti13.github.io/portfolio-tester`

**To start:** `cd backend && npm start` ✨ 