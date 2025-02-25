import express from 'express';
import { fetchHistoricalData } from './services/yahoo.js';

const router = express.Router();

router.get('/historical-data', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const data = await fetchHistoricalData(startDate, endDate);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/simulate', async (req, res) => {
    try {
        const { initialAmount, monthlyContribution, years } = req.query;
        // Add simulation logic here
        res.json({ message: "Simulation endpoint" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
