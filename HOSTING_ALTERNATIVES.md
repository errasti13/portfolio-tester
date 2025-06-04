# 🌐 Hosting Alternatives to ngrok

## 🚀 Quick Start Options

### 1. **Localtunnel** (EASIEST - Already set up!)
```bash
# Run the script
./start-with-localtunnel.ps1
# OR
start-with-localtunnel.bat
```
- ✅ **Free forever**
- ✅ **No account required**
- ✅ **Custom subdomains**
- ✅ **Already installed and configured**

Your URLs will be:
- Frontend: `https://portfolio-frontend.loca.lt`
- Backend: `https://portfolio-api.loca.lt`

---

### 2. **Serveo** (SSH-based tunneling)
```bash
# Frontend tunnel
ssh -R 80:localhost:3000 serveo.net

# Backend tunnel (new terminal)
ssh -R 80:localhost:5000 serveo.net
```
- ✅ **No installation required**
- ✅ **SSH-based (very secure)**
- ✅ **Free**

---

### 3. **Bore** (Rust-based tunnel)
```bash
# Install
cargo install bore-cli
# OR download from: https://github.com/ekzhang/bore/releases

# Frontend tunnel
bore local 3000 --to bore.pub

# Backend tunnel
bore local 5000 --to bore.pub
```

---

### 4. **Cloudflare Tunnel** (Enterprise-grade)
```bash
# Install cloudflared
# Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

# Quick tunnel (no account needed)
cloudflared tunnel --url http://localhost:3000
```

---

## 🔄 Alternative Development Servers

### 5. **Live Server + Port Forwarding**
If you have access to your router, you can:
1. Configure port forwarding on your router (ports 3000, 5000)
2. Use your public IP address
3. Access via: `http://YOUR_PUBLIC_IP:3000`

### 6. **Vite Network Mode**
Update your `frontend/vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0', // Allow external connections
    open: true
  }
})
```

Then access via your local IP: `http://192.168.1.X:3000`

---

## 🌟 Free Cloud Hosting Options

### 7. **Vercel** (Recommended for production)
```bash
npm install -g vercel
vercel --prod
```

### 8. **Netlify**
```bash
npm install -g netlify-cli
netlify dev
```

### 9. **Railway**
```bash
npm install -g @railway/cli
railway login
railway deploy
```

---

## 🛠️ Quick Setup Scripts

I've created these scripts for you:

1. **`start-with-localtunnel.ps1`** - PowerShell version
2. **`start-with-localtunnel.bat`** - Windows batch version
3. **`start-with-ngrok.ps1`** - Original ngrok version (if you fix the session limit)

## 📝 Usage Instructions

### For Localtunnel (Recommended):
```bash
./start-with-localtunnel.ps1
```

### Manual Localtunnel:
```bash
# Terminal 1: Start backend
npm run dev:backend

# Terminal 2: Start frontend  
npm run dev:frontend

# Terminal 3: Frontend tunnel
lt --port 3000 --subdomain portfolio-frontend

# Terminal 4: Backend tunnel
lt --port 5000 --subdomain portfolio-api
```

## 🔧 Troubleshooting

### If localtunnel subdomain is taken:
```bash
# Use random subdomains
lt --port 3000
lt --port 5000
```

### If you need HTTPS for API calls:
Update your frontend API base URL to use the tunnel URL:
```javascript
const API_BASE_URL = 'https://portfolio-api.loca.lt/api';
```

---

## 🎯 Best Choice for You

**Use Localtunnel** - it's already set up and works great for development!

Just run: `./start-with-localtunnel.ps1` 