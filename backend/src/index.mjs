import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

app.get("/api/stocks/:symbol", async (req, res) => {
    try {
        const symbol = req.params.symbol.toUpperCase();
        const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        );
        const data = await response.json();
        res.json({
            symbol,
            price: data.c,
            high: data.h,
            low: data.l,
            open: data.o,
            prevClose: data.pc
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching stock data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
