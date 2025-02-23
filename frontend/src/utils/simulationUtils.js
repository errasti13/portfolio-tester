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

export const runSimulations = (portfolioData, portfolio, years, initialInvestment, periodicInvestment = 0, frequency = 'monthly') => {
    if (!portfolioData || Object.keys(portfolioData).length === 0) {
        throw new Error('Invalid portfolio data');
    }

    // Convert daily data to monthly for each asset
    const monthlyPortfolioData = {};
    Object.entries(portfolioData).forEach(([assetId, data]) => {
        monthlyPortfolioData[assetId] = convertToMonthlyData(data);
    });

    const monthsPerYear = 12;
    const simulationLength = years * monthsPerYear;
    const investmentInterval = frequency === 'monthly' ? 1 : monthsPerYear;
    const numSimulations = 100;

    // Calculate true monthly returns (accounting for compounding)
    const calculateMonthlyReturns = (data) => {
        const returns = [];
        for (let i = 1; i < data.length; i++) {
            const monthlyReturn = (data[i].close / data[i-1].close) - 1;
            returns.push(monthlyReturn);
        }
        return returns;
    };

    // Calculate returns for each asset
    const assetReturns = {};
    Object.entries(monthlyPortfolioData).forEach(([assetId, data]) => {
        assetReturns[assetId] = calculateMonthlyReturns(data);
    });

    const minDataPoints = Math.min(...Object.values(assetReturns).map(returns => returns.length));
    if (minDataPoints < simulationLength) {
        throw new Error(`Insufficient data for ${years} year simulation`);
    }

    const simulations = [];

    for (let i = 0; i < numSimulations; i++) {
        try {
            const startIdx = Math.floor(Math.random() * (minDataPoints - simulationLength));
            let value = initialInvestment;
            let totalInvested = initialInvestment;
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
                // Calculate weighted portfolio return
                const monthlyReturn = portfolio.reduce((sum, asset) => {
                    const assetMonthlyReturn = assetReturns[asset.assetId][startIdx + month];
                    return sum + (assetMonthlyReturn * (asset.allocation / 100));
                }, 0);

                // Apply return to current value
                value *= (1 + monthlyReturn);

                // Add periodic investment
                if (periodicInvestment > 0 && month % investmentInterval === 0) {
                    value += periodicInvestment;
                    totalInvested += periodicInvestment;
                    investments.push({
                        amount: periodicInvestment,
                        monthsInvested: simulationLength - month
                    });
                }

                valueHistory.push({
                    date: monthlyPortfolioData[portfolio[0].assetId][startIdx + month + 1].date,
                    value
                });
            }

            // Calculate Money-Weighted Return (considers timing of cash flows)
            const totalReturn = ((value - totalInvested) / totalInvested) * 100;

            // Calculate true CAGR (Compound Annual Growth Rate)
            const weightedInitialValue = investments.reduce((sum, inv) => {
                return sum + (inv.amount * (inv.monthsInvested / simulationLength));
            }, 0);
            
            const annualizedReturn = (Math.pow(value / weightedInitialValue, 12 / simulationLength) - 1) * 100;

            simulations.push({
                return: totalReturn,
                annualizedReturn,
                initialInvestment,
                totalInvested,
                finalValue: value,
                data: valueHistory,
                startDate: new Date(valueHistory[0].date),
                endDate: new Date(valueHistory[valueHistory.length - 1].date),
                maxDrawdown: calculateMaxDrawdown(valueHistory)
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
    return {
        best: simulations[0],
        worst: simulations[simulations.length - 1],
        median: simulations[Math.floor(simulations.length / 2)]
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
        const drawdown = ((peak - day.value) / peak) * 100;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    return maxDrawdown;
};