import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const FRONTEND_DIR = path.join(__dirname, '../../frontend/dist');
const DATA_DIR = path.join(__dirname, "../data");

const ASSETS = {
    'SP500': {
        csvFile: "SP500.csv",
        name: 'S&P 500'
    },
    'MSCI_WORLD': {
        csvFile: "MSCIWorld.csv",
        name: 'MSCI World'
    },
    'Emerging_Markets': {
        csvFile: "MSCI_Emerging.csv",
        name: 'MSCI Emerging Markets'
    },
    'Gold': {
        csvFile: "Gold.csv",
        name: 'Gold'
    },
    'Silver': {
        csvFile: "Silver.csv",
        name: 'Silver'
    },
    'EuroStoxx50': {
        csvFile: "Euro_Stoxx.csv",
        name: 'EuroStoxx 50'
    },
    'Russell2000': {
        csvFile: "Russell_2000.csv",
        name: 'Russell 2000'
    },
    '3 Year Treasury': {
        csvFile: "3Y_Treasury.csv",
        name: '3 Year Treasury'
    },
    '7 Year Treasury': {
        csvFile: "7Y_Treasury.csv",
        name: '7 Year Treasury'
    },
    '30 Year Treasury': {
        csvFile: "30Y_Treasury.csv",
        name: '30 Year Treasury'
    }
};

// Helper: parse mm/yyyy date string from various formats to Date object
const parseDateStr = (dateStr) => {
    // Handle different date formats (mm/yyyy or mm/yy)
    const [month, yearStr] = dateStr.split("/").map(s => s.trim());
    const year = parseInt(yearStr);
    // If year < 100 assume 2000+ for 00-99, or 1900+ for earlier years
    const fullYear = year < 100 ? (year < 50 ? 2000 + year : 1900 + year) : year;
    return new Date(fullYear, parseInt(month) - 1, 1);
};

// Helper: read and parse CSV file with header (format: Date,AssetName)
const loadCSVData = async (csvFile) => {
    const filePath = path.join(DATA_DIR, csvFile);
    const content = await fs.readFile(filePath, "utf8");
    const lines = content.split("\n").filter(line => line.trim());
    
    // Skip header line
    const dataLines = lines.slice(1);
    
    // Parse data and calculate returns
    const values = dataLines.map(line => {
        const [dateStr, valueStr] = line.split(",");
        return {
            date: parseDateStr(dateStr.trim()),
            value: Number(valueStr.trim())
        };
    });
    
    // Calculate monthly returns
    const returns = [];
    for (let i = 1; i < values.length; i++) {
        const prevValue = values[i-1].value;
        const currValue = values[i].value;
        const monthlyReturn = ((currValue / prevValue) - 1) * 100; // as percentage
        
        returns.push({
            date: values[i].date,
            value: currValue,
            monthlyReturn: parseFloat(monthlyReturn.toFixed(2))
        });
    }
    
    return {
        values,
        returns
    };
};

const getAssetFullInfo = async (csvFile) => {
    try {
        const data = await loadCSVData(csvFile);
        if (!data.values.length) throw new Error("No data available");
        const firstDate = data.values[0].date;
        const yearsOfData = Number(
            (((new Date()) - firstDate) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)
        );
        return {
            firstDate,
            yearsOfData,
            dataPoints: data.values.length
        };
    } catch (error) {
        console.error(`Error reading CSV ${csvFile}:`, error);
        return { firstDate: null, yearsOfData: 0, dataPoints: 0 };
    }
};

const getAssetHistory = async (csvFile) => {
    const data = await loadCSVData(csvFile);
    const history = data.values.map(item => ({
        date: item.date,
        close: item.value,
        high: item.value,
        low: item.value,
        volume: 0
    }));
    if (history.length === 0) {
        throw new Error("No valid data found");
    }
    return history;
};

const getAssetReturns = async (csvFile) => {
    const data = await loadCSVData(csvFile);
    if (data.returns.length === 0) {
        throw new Error("No valid return data found");
    }
    return data.returns;
};

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration to support multiple deployment platforms
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // List of allowed origins
        const allowedOrigins = [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://192.168.1.134:3000',  // Local network access
            'https://errasti13.github.io', // Replace with your GitHub username
            /\.github\.io$/,  // Any GitHub Pages domain
            /\.vercel\.app$/,  // Vercel deployments
            /\.netlify\.app$/, // Netlify deployments
            /\.railway\.app$/, // Railway deployments
            /\.loca\.lt$/,     // Localtunnel for development
            /^http:\/\/192\.168\.1\.\d+:3000$/  // Allow any device on local network
        ];
        
        // Check if origin is allowed
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return origin === allowedOrigin;
            } else if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }
            return false;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files from the frontend build directory
app.use(express.static(FRONTEND_DIR));

// Assets endpoint
app.get("/api/assets", async (req, res) => {
    try {
        const assetsWithInfo = await Promise.all(
            Object.entries(ASSETS).map(async ([key, asset]) => {
                const info = await getAssetFullInfo(asset.csvFile);
                return {
                    id: key,
                    name: asset.name,
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

// Asset history endpoint
app.get("/api/asset/:assetId/history", async (req, res) => {
    try {
        const { assetId } = req.params;
        const asset = ASSETS[assetId];
        if (!asset) {
            return res.status(400).json({ error: "Invalid asset ID" });
        }
        const history = await getAssetHistory(asset.csvFile);
        res.json(history);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || `Error fetching ${req.params.assetId} data` });
    }
});

// New endpoint for asset returns
app.get("/api/asset/:assetId/returns", async (req, res) => {
    try {
        const { assetId } = req.params;
        const asset = ASSETS[assetId];
        if (!asset) {
            return res.status(400).json({ error: "Invalid asset ID" });
        }
        const returns = await getAssetReturns(asset.csvFile);
        res.json(returns);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || `Error fetching ${req.params.assetId} returns` });
    }
});

// Add this at the end, after all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
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
    process.exit(1);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT} and accessible from:`);
    console.log(`  Local:    http://localhost:${PORT}`);
    console.log(`  Network:  http://192.168.1.134:${PORT}`);
    console.log(`  Frontend: https://errasti13.github.io/portfolio-tester`);
});