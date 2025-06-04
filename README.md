# 📊 Portfolio Investment Simulator

A professional web application that simulates historical investment scenarios across multiple asset classes including S&P 500, MSCI World, Gold, Silver, and more.

## 🚀 **NEW: Free Hosting Available!**

Deploy your portfolio **completely FREE** using GitHub Pages + Railway. No credit card required!

### Quick Deploy (5 minutes):
```bash
# Windows
.\deploy.ps1

# Mac/Linux  
chmod +x deploy.sh && ./deploy.sh
```

**📖 [Full Deployment Guide](DEPLOYMENT_GUIDE.md)**

---

## ✨ Features

- 📈 **Multi-Asset Support**: S&P 500, MSCI World, Emerging Markets, Gold, Silver, Treasury Bonds
- 🎯 **Historical Simulation**: Backtest investment strategies with real historical data
- 📊 **Advanced Analytics**: Monte Carlo simulations, best/worst case scenarios
- 💰 **Portfolio Optimization**: Compare different asset allocations
- 📱 **Mobile Responsive**: Works perfectly on all devices
- 🌐 **Professional Deployment**: GitHub Pages + Railway hosting

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Chart.js, Tailwind CSS
- **Backend**: Node.js, Express.js, CSV data processing
- **Deployment**: GitHub Pages (Frontend), Railway (Backend)
- **Data**: Historical market data (20+ years)

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Local Development

1. **Clone the repository:**
```bash
git clone [your-repository-url]
cd portfolio-tester
```

2. **Install dependencies:**
```bash
# Backend
cd backend && npm install

# Frontend  
cd ../frontend && npm install
```

3. **Start both servers:**
```bash
# Start backend (Terminal 1)
cd backend && npm start

# Start frontend (Terminal 2)  
cd frontend && npm run dev
```

4. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api`

## 🌐 Production Deployment

### Option 1: Free Hosting (Recommended)
- **Frontend**: GitHub Pages (Free, unlimited bandwidth)
- **Backend**: Railway (Free tier, 500 hours/month)
- **Total Cost**: $0/month

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for step-by-step instructions.

### Option 2: Alternative Platforms
- **Vercel** (Frontend) + **Render** (Backend)
- **Netlify** (Frontend) + **Fly.io** (Backend)
- **Firebase Hosting** + **Google Cloud Run**

## 📊 Available Assets

| Asset | Data Range | Description |
|-------|------------|-------------|
| S&P 500 | 1970+ | US Large Cap Stocks |
| MSCI World | 1970+ | Global Developed Markets |
| Emerging Markets | 1988+ | Emerging Market Stocks |
| Gold | 1968+ | Gold Spot Price |
| Silver | 1968+ | Silver Spot Price |
| EuroStoxx 50 | 1987+ | European Stocks |
| Russell 2000 | 1987+ | US Small Cap Stocks |
| 3Y Treasury | 1982+ | US 3-Year Bonds |
| 7Y Treasury | 1969+ | US 7-Year Bonds |
| 30Y Treasury | 1977+ | US 30-Year Bonds |

## 🔧 Advanced Features

- **Monte Carlo Simulation**: 1000+ iterations for statistical analysis
- **Risk Metrics**: Volatility, Sharpe ratio, maximum drawdown
- **Rebalancing Strategies**: Monthly, quarterly, annual rebalancing
- **Tax Considerations**: Pre-tax vs. post-tax scenarios
- **Inflation Adjustment**: Real vs. nominal returns

## 📈 Use Cases

- **Personal Finance**: Plan retirement and investment strategies
- **Education**: Learn about historical market performance
- **Research**: Analyze asset allocation strategies
- **Professional**: Client presentations and analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🎯 Ready to Deploy?

**Start with the free hosting option:**

1. Run `./deploy.ps1` (Windows) or `./deploy.sh` (Mac/Linux)
2. Follow the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
3. Share your professional portfolio with the world! 🚀

**Questions?** Check out the [troubleshooting section](DEPLOYMENT_GUIDE.md#troubleshooting) in the deployment guide.
