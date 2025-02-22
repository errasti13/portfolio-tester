import express from "express";
import cors from "cors";
import yahooFinance from "yahoo-finance2";
import dotenv from "dotenv";

dotenv.config();
// Suppress deprecated warning
yahooFinance.suppressNotices(['ripHistorical']);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET'],
    credentials: true
}));
app.use(express.json());

app.get("/api/sp500/history", async (req, res) => {
    try {
        const queryOptions = {
            period1: new Date('1950-01-01'),
            period2: new Date(),
            interval: '1d',
            includeAdjustedClose: true
        };
        
        console.log('Fetching S&P 500 historical data...');
        const result = await yahooFinance.chart('^GSPC', queryOptions);
        
        const historicalData = result.quotes.map(item => ({
            date: item.date,
            close: item.close,
            high: item.high,
            low: item.low,
            volume: item.volume
        }));
        
        res.json(historicalData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || "Error fetching S&P 500 data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
