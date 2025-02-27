// Cache for monthly data conversion
const monthlyPortfolioDataCache = new Map();

// Convert daily data to monthly data properly
const convertToMonthlyData = (dailyData) => {
    const monthlyData = [];
    let currentMonth = null;
    let monthStart = null;

    dailyData.forEach(day => {
        const date = new Date(day.date);
        const monthYear = `${date.getFullYear()}-${date.getMonth()}`;

        if (monthYear !== currentMonth) {
            if (monthStart) {
                monthlyData.push({
                    date: monthStart.date,
                    close: day.close  // Use closing price of last day of month
                });
            }
            currentMonth = monthYear;
            monthStart = day;
        }
    });

    // Add the last month
    if (monthStart) {
        monthlyData.push({
            date: monthStart.date,
            close: dailyData[dailyData.length - 1].close
        });
    }

    return monthlyData;
};

// Get monthly data with caching
const getMonthlyData = (assetId, data) => {
    if (!monthlyPortfolioDataCache.has(assetId)) {
        monthlyPortfolioDataCache.set(assetId, convertToMonthlyData(data));
    }
    return monthlyPortfolioDataCache.get(assetId);
};

// Clear cache when it gets too large
const clearCacheIfNeeded = () => {
    if (monthlyPortfolioDataCache.size > 100) {
        monthlyPortfolioDataCache.clear();
    }
};

export const runSimulations = (portfolioData, portfolio, years, initialInvestment, periodicInvestment = 0, frequency = 'monthly') => {
    if (!portfolioData || Object.keys(portfolioData).length === 0) {
        throw new Error('Invalid portfolio data');
    }

    clearCacheIfNeeded();

    // Convert daily data to monthly for each asset
    const monthlyPortfolioData = {};
    Object.entries(portfolioData).forEach(([assetId, data]) => {
        monthlyPortfolioData[assetId] = getMonthlyData(assetId, data);
    });

    const monthsPerYear = 12;
    const simulationLength = years * monthsPerYear;
    const investmentInterval = frequency === 'monthly' ? 1 : monthsPerYear;
    const numSimulations = 10000;

    // Calculate true monthly returns (accounting for compounding)
    const calculateMonthlyReturns = (data) => {
        const returns = [];
        for (let i = 1; i < data.length; i++) {
            const monthlyReturn = (data[i].close / data[i-1].close) - 1;
            returns.push(monthlyReturn);
        }
        return returns;
    };

    // Calculate returns for each asset with caching
    const assetReturns = {};
    Object.entries(monthlyPortfolioData).forEach(([assetId, data]) => {
        assetReturns[assetId] = calculateMonthlyReturns(data);
    });

    const minDataPoints = Math.min(...Object.values(assetReturns).map(returns => returns.length));
    if (minDataPoints < simulationLength) {
        throw new Error(`Insufficient data for ${years} year simulation`);
    }

    const simulations = [];
    const SMALL_VALUE_THRESHOLD = 0.01;

    for (let i = 0; i < numSimulations; i++) {
        try {
            const startIdx = Math.floor(Math.random() * (minDataPoints - simulationLength));
            let value = initialInvestment;
            let totalInvested = initialInvestment;
            let isPortfolioActive = true;
            const valueHistory = [{ 
                date: monthlyPortfolioData[portfolio[0].assetId][startIdx].date,
                value 
            }];

            // Track amount invested for CAGR calculation
            const investments = [{
                amount: initialInvestment,
                monthsInvested: simulationLength
            }];

            for (let month = 0; month < simulationLength; month++) {
                if (isPortfolioActive) {
                    // Calculate weighted portfolio return
                    const monthlyReturn = portfolio.reduce((sum, asset) => {
                        const assetMonthlyReturn = assetReturns[asset.assetId][startIdx + month];
                        return sum + (assetMonthlyReturn * (asset.allocation / 100));
                    }, 0);

                    // Apply return to current value
                    value *= (1 + monthlyReturn);

                    // Handle periodic investment or withdrawal
                    if (month % investmentInterval === 0) {
                        value += periodicInvestment;
                        // Only add positive investments to totalInvested
                        if (periodicInvestment > 0) {
                            totalInvested += periodicInvestment;
                            investments.push({
                                amount: periodicInvestment,
                                monthsInvested: simulationLength - month
                            });
                        }
                    }

                    // Check for small value threshold
                    if (value < SMALL_VALUE_THRESHOLD) {
                        value = 0;
                        isPortfolioActive = false;
                    }
                }

                valueHistory.push({
                    date: monthlyPortfolioData[portfolio[0].assetId][startIdx + month + 1].date,
                    value
                });
            }

            // Fix return calculations
            let totalReturn = totalInvested > 0 ? (value / totalInvested - 1) : -1;
            let annualizedReturn = Math.pow(1 + totalReturn, 1 / years) - 1;

            // Convert to percentages with 2 decimal places
            totalReturn = parseFloat((totalReturn * 100).toFixed(2));
            annualizedReturn = parseFloat((annualizedReturn * 100).toFixed(2));

            simulations.push({
                return: totalReturn,
                annualizedReturn,
                initialInvestment,
                totalInvested,
                totalWithdrawn: periodicInvestment < 0 ? Math.abs(periodicInvestment * (simulationLength / investmentInterval)) : 0,
                finalValue: value,
                data: valueHistory,
                startDate: new Date(valueHistory[0].date),
                endDate: new Date(valueHistory[valueHistory.length - 1].date),
                maxDrawdown: calculateMaxDrawdown(valueHistory),
                portfolioDepletionMonth: isPortfolioActive ? null : valueHistory.findIndex(vh => vh.value === 0)
            });
        } catch (error) {
            console.error('Simulation error:', error);
            continue;
        }
    }

    if (simulations.length === 0) {
        throw new Error('All simulations failed');
    }

    simulations.sort((a, b) => b.return - a.return);
    
    // Calculate additional statistics
    const medianIndex = Math.floor(simulations.length / 2);
    const successRate = (simulations.filter(s => s.finalValue > 0).length / simulations.length) * 100;

    return {
        best: simulations[0],
        worst: simulations[simulations.length - 1],
        median: simulations[medianIndex],
        successRate,
        totalSimulations: simulations.length
    };
};

// Helper function to calculate maximum drawdown
const calculateMaxDrawdown = (valueHistory) => {
    let maxDrawdown = 0;
    let peak = valueHistory[0].value;

    for (const day of valueHistory) {
        if (day.value > peak) {
            peak = day.value;
        }
        const drawdown = peak > 0 ? ((peak - day.value) / peak) * 100 : 0;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    return parseFloat(maxDrawdown.toFixed(2));
};