// Validation rules for simulation inputs
export const validateSimulationInputs = (inputs) => {
    const {
        initialInvestment,
        simulationYears,
        periodicInvestment,
        portfolio,
        investmentFrequency = 'monthly',
        currentPortfolioValue = null // Optional, for comparing with initial investment
    } = inputs;

    const warnings = [];
    const errors = [];

    // Convert values to numbers
    const numInitialInvestment = Number(initialInvestment);
    const numSimulationYears = Number(simulationYears);
    const numPeriodicInvestment = Number(periodicInvestment);

    // Required field validation
    if (initialInvestment === '') {
        errors.push('Initial investment is required');
    }
    if (simulationYears === '') {
        errors.push('Simulation period is required');
    }
    if (periodicInvestment === '') {
        errors.push('Periodic investment/withdrawal is required');
    }

    // Numeric validation
    if (isNaN(numInitialInvestment) || isNaN(numSimulationYears) || isNaN(numPeriodicInvestment)) {
        errors.push('All investment fields must be valid numbers');
    }

    // Business logic validation
    if (numInitialInvestment < 0) {
        errors.push('Initial investment cannot be negative');
    }

    if (numSimulationYears <= 0) {
        errors.push('Simulation period must be greater than 0 years');
    }

    if (numSimulationYears > 50) {
        warnings.push('Long simulation periods (>50 years) may be less accurate');
    }

    // Portfolio allocation validation
    const totalAllocation = portfolio.reduce((sum, asset) => {
        const allocation = asset.allocation === '' ? 0 : Number(asset.allocation);
        return sum + allocation;
    }, 0);

    if (totalAllocation !== 100) {
        errors.push('Total allocation must equal 100%');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        hasWarnings: warnings.length > 0
    };
}; 