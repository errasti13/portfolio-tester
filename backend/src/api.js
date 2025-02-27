import express from 'express';
import { fetchHistoricalData } from './services/data.js';
import { validateHistoricalData, validateSimulation } from './middleware/validation.js';

const router = express.Router();

router.get('/historical-data', validateHistoricalData, async (req, res) => {
    try {
        const { startDate, endDate, assetId } = req.query;
        const data = await fetchHistoricalData(startDate, endDate, assetId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/simulate', validateSimulation, async (req, res) => {
    try {
        const { initialAmount, monthlyContribution, years } = req.query;
        // Add simulation logic here
        res.json({ message: "Simulation endpoint" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
