import { query, validationResult } from 'express-validator';

export const validateHistoricalData = [
    query('startDate')
        .isDate()
        .withMessage('Start date must be a valid date'),
    query('endDate')
        .isDate()
        .withMessage('End date must be a valid date'),
    validateResults
];

export const validateSimulation = [
    query('initialAmount')
        .isFloat({ min: 0 })
        .withMessage('Initial amount must be a positive number'),
    query('years')
        .isInt({ min: 1, max: 100 })
        .withMessage('Years must be between 1 and 100'),
    validateResults
];

function validateResults(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}
