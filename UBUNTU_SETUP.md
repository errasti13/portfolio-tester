# 🐧 Ubuntu/WSL Setup Guide

Perfect choice! Ubuntu/WSL provides a much better development experience for Node.js projects.

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Ubuntu on WSL2

If you don't have Ubuntu installed yet:

```powershell
# In Windows PowerShell (as Administrator)
wsl --install -d Ubuntu-20.04
```

Or install from Microsoft Store:
- Open Microsoft Store
- Search "Ubuntu 20.04 LTS"
- Install and launch

### Step 2: Access Your Project in WSL

```bash
# In Ubuntu terminal, navigate to your Windows project
cd /mnt/c/Users/Jon/Desktop/Jon\ Errasti/Personal_Projects/portfolio-tester

# Or copy project to WSL (recommended for better performance)
cp -r /mnt/c/Users/Jon/Desktop/Jon\ Errasti/Personal_Projects/portfolio-tester ~/
cd ~/portfolio-tester
```

### Step 3: Run Setup Script

```bash
# Make scripts executable
chmod +x setup-ubuntu.sh start-ubuntu.sh

# Run the setup (installs Node.js and dependencies)
./setup-ubuntu.sh
```

### Step 4: Start Your Portfolio

```bash
# Start the backend
./start-ubuntu.sh
```

### Step 5: Enable GitHub Pages

1. Go to: `https://github.com/errasti13/portfolio-tester`
2. Settings → Pages → Source: **GitHub Actions**
3. Wait 5 minutes for deployment

## 🎯 Your URLs

- **Frontend**: `https://errasti13.github.io/portfolio-tester` (always available)
- **Backend**: `http://localhost:5000` (when running locally)

## ✅ Advantages of Ubuntu/WSL Setup

- ✅ **Faster**: No Windows path issues
- ✅ **Reliable**: Linux package management
- ✅ **Professional**: Same environment as production servers
- ✅ **Easy**: One-command setup
- ✅ **Free**: No costs involved

## 🔧 Useful Commands

```bash
# Start backend
./start-ubuntu.sh

# Stop backend
Ctrl+C

# Check if backend is running
curl http://localhost:5000/api/assets

# View logs
cd backend && npm start

# Update dependencies
cd backend && npm install
cd frontend && npm install

# Build frontend locally
cd frontend && npm run build
```

## 🐛 Troubleshooting

### Permission Issues
```bash
# Fix script permissions
chmod +x setup-ubuntu.sh start-ubuntu.sh

# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

### Port Already in Use
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

### Node.js Issues
```bash
# Check Node.js version
node --version
npm --version

# Reinstall if needed
sudo apt remove nodejs npm
./setup-ubuntu.sh
```

## 💡 Pro Tips

### 1. Use WSL2 for Best Performance
```bash
# Check WSL version
wsl --list --verbose

# Upgrade to WSL2 if needed
wsl --set-version Ubuntu-20.04 2
```

### 2. Install Windows Terminal
- Download from Microsoft Store
- Better terminal experience for WSL

### 3. VS Code Integration
```bash
# Install VS Code extension for WSL
code .  # Opens project in VS Code with WSL integration
```

### 4. Copy Project to WSL (Recommended)
```bash
# Better performance when files are in WSL filesystem
cp -r /mnt/c/Users/Jon/Desktop/Jon\ Errasti/Personal_Projects/portfolio-tester ~/
cd ~/portfolio-tester
```

## 🌟 Development Workflow

### Daily Usage:
```bash
# 1. Open Ubuntu terminal
# 2. Navigate to project
cd ~/portfolio-tester  # or your project path

# 3. Start backend
./start-ubuntu.sh

# 4. Open frontend in browser
# https://errasti13.github.io/portfolio-tester
```

### Making Changes:
```bash
# Frontend changes: commit and push to GitHub
git add .
git commit -m "Update frontend"
git push origin master

# Backend changes: restart server
Ctrl+C
./start-ubuntu.sh
```

## 🎉 You're Ready!

Your Ubuntu setup will give you:
- **Professional development environment**
- **Same tools as GitHub Actions**
- **Better performance and reliability**
- **Industry-standard workflow**

Run `./setup-ubuntu.sh` and you'll be up and running in minutes! 🚀 