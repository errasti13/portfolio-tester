import fs from 'fs/promises';
import path from 'path';
import { config } from '../config/index.js';
import winston from 'winston';

// Ensure logs directory exists
try {
    await fs.mkdir(config.logDir, { recursive: true });
} catch (error) {
    console.error('Error creating logs directory:', error);
}

// Configure logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ 
            filename: path.join(config.logDir, 'error.log'), 
            level: 'error' 
        }),
        new winston.transports.File({ 
            filename: path.join(config.logDir, 'combined.log')
        }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

// ... rest of the file stays the same ... 