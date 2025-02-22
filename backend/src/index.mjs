import express from "express";
import cors from "cors";
import yahooFinance from "yahoo-finance2";
import dotenv from "dotenv";

dotenv.config();
yahooFinance.suppressNotices(['ripHistorical']);

const ASSETS = {
    'SP500': '^SP500TR',  // S&P 500 Total Return Index
    'NASDAQ': '^NDX',  // NASDAQ 100 Index
    'DOW_JONES': '^DJI',  // Dow Jones Industrial Average
    'GOLD': 'GLD',  // Changed from GC=F to GLD (SPDR Gold Shares ETF)
    'BITCOIN': 'BTC-USD',  // Bitcoin
    'OIL': 'CL=F',  // Crude Oil Futures
    'EUR_USD': 'EURUSD=X',  // EUR/USD Exchange Rate
    'USD_JPY': 'USDJPY=X',  // USD/JPY Exchange Rate
    'GBP_USD': 'GBPUSD=X',  // GBP/USD Exchange Rate
    'VIX': '^VIX',  // CBOE Volatility Index
    'FTSE100': '^FTSE',  // FTSE 100 Index
    'MSCI_WORLD': '^990100-USD-STRD',  // MSCI World Index ETF
    'EURO_STOCKS': '^STOXX50E',  // EURO STOXX 50
    'US_10Y_BONDS': '^TNX'  // 10-Year Treasury Yield
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET'],
    credentials: true
}));
app.use(express.json());

const getAssetFirstDate = async (symbol) => {
    try {
        const result = await yahooFinance.chart(symbol, {
            period1: new Date('1900-01-01'),
            period2: new Date(),
            interval: '1mo'
        });
        return result.quotes[0]?.date || null;
    } catch (error) {
        console.error(`Error fetching first date for ${symbol}:`, error);
        return null;
    }
};

app.get("/api/assets", async (req, res) => {
    try {
        const assetsWithDates = await Promise.all(
            Object.entries(ASSETS).map(async ([key, symbol]) => {
                const firstDate = await getAssetFirstDate(symbol);
                return {
                    id: key,
                    name: key.replace(/_/g, ' '),
                    firstAvailableDate: firstDate,
                    symbol
                };
            })
        );
        res.json(assetsWithDates);
    } catch (error) {
        console.error('Error fetching assets data:', error);
        res.status(500).json({ error: 'Failed to fetch assets information' });
    }
});

// Modified endpoint to fetch specific asset history
app.get("/api/asset/:assetId/history", async (req, res) => {
    try {
        const { assetId } = req.params;
        const symbol = ASSETS[assetId];

        if (!symbol) {
            return res.status(400).json({ error: "Invalid asset ID" });
        }

        const queryOptions = {
            period1: new Date('1950-01-01'),
            period2: new Date(),
            interval: '1d',
            includeAdjustedClose: true
        };
        
        console.log(`Fetching ${assetId} historical data...`);
        const result = await yahooFinance.chart(symbol, queryOptions);
        
        const historicalData = result.quotes
            .filter(item => 
                item && 
                item.close && 
                !isNaN(item.close) && 
                item.date
            )
            .map(item => ({
                date: item.date,
                close: item.close,
                high: item.high || item.close,
                low: item.low || item.close,
                volume: item.volume || 0
            }));

        if (historicalData.length === 0) {
            throw new Error(`No valid data found for ${assetId}`);
        }
        
        res.json(historicalData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || `Error fetching ${assetId} data` });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
