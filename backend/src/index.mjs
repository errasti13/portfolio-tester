import express from "express";
import cors from "cors";
import yahooFinance from "yahoo-finance2";
import dotenv from "dotenv";

dotenv.config();
yahooFinance.suppressNotices(['ripHistorical']);

const ASSETS = {
    'SP500': {
        symbols: ['^SP500TR'],  // S&P 500 Index and ETF
        name: 'S&P 500'
    },
    'MSCI_WORLD': {
        symbols: ['IWDA.AS'],  // Multiple MSCI World ETFs
        name: 'MSCI World'
    },
    'EURO_STOCKS': {
        symbols: ['FEZ', '^STOXX50E'],  // EURO STOXX 50 ETF and Index
        name: 'Euro Stoxx 50'
    },
    'GOLD': {
        symbols: ['GC=F'],  // Gold ETFs
        name: 'Gold'
    },
    'US_10Y_BONDS': {
        symbols: ['^TNX'],  // Treasury ETF and Yield
        name: '10-Year Treasury'
    }
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET'],
    credentials: true
}));
app.use(express.json());

const getAssetFullInfo = async (symbol) => {
    try {
        const result = await yahooFinance.chart(symbol, {
            period1: new Date('1900-01-01'),
            period2: new Date(),
            interval: '1mo'
        });
        const firstDate = result.quotes[0]?.date || null;
        const yearsOfData = firstDate ? 
            ((new Date() - new Date(firstDate)) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1) : 
            0;
        
        return {
            firstDate,
            yearsOfData: Number(yearsOfData),
            dataPoints: result.quotes.length
        };
    } catch (error) {
        console.error(`Error fetching info for ${symbol}:`, error);
        return { firstDate: null, yearsOfData: 0, dataPoints: 0 };
    }
};

const getAssetBestData = async (symbols) => {
    for (const symbol of symbols) {
        try {
            console.log(`Trying symbol: ${symbol}`);
            const result = await yahooFinance.chart(symbol, {
                period1: '1900-01-01',
                period2: new Date().toISOString().split('T')[0],
                interval: '1d'
            });

            if (result && result.quotes && result.quotes.length > 0) {
                console.log(`Successfully fetched data for ${symbol}`);
                return result;
            }
        } catch (error) {
            console.error(`Failed to fetch data for symbol ${symbol}:`, error);
            continue;
        }
    }
    throw new Error('No valid data found for any symbol');
};

app.get("/api/assets", async (req, res) => {
    try {
        const assetsWithInfo = await Promise.all(
            Object.entries(ASSETS).map(async ([key, asset]) => {
                const info = await getAssetFullInfo(asset.symbols[0]);
                return {
                    id: key,
                    name: asset.name,
                    symbol: asset.symbols[0],
                    firstAvailableDate: info.firstDate,
                    yearsOfData: info.yearsOfData,
                    dataPoints: info.dataPoints
                };
            })
        );

        // Sort assets by years of data available
        const sortedAssets = assetsWithInfo.sort((a, b) => b.yearsOfData - a.yearsOfData);
        
        res.json(sortedAssets);
    } catch (error) {
        console.error('Error fetching assets data:', error);
        res.status(500).json({ error: 'Failed to fetch assets information' });
    }
});

// Modified endpoint to fetch specific asset history
app.get("/api/asset/:assetId/history", async (req, res) => {
    try {
        const { assetId } = req.params;
        const asset = ASSETS[assetId];

        if (!asset) {
            return res.status(400).json({ error: "Invalid asset ID" });
        }

        const result = await getAssetBestData(asset.symbols);
        
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

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1); // Optional: exit the process to avoid unknown state
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
