export interface Asset {
    id: string;
    name: string;
    firstAvailableDate: string;
}

export interface PortfolioAsset {
    assetId: string;
    allocation: number;
}

export interface SimulationParams {
    years: number;
    initialInvestment: number;
    periodicInvestment: number;
    investmentFrequency: 'monthly' | 'yearly';
}

export interface SimulationResult {
    return: number;
    annualizedReturn: number;
    initialInvestment: number;
    totalInvested: number;
    finalValue: number;
    data: Array<{ date: string; value: number }>;
    startDate: Date;
    endDate: Date;
    maxDrawdown: number;
}

export interface SimulationResults {
    best: SimulationResult;
    median: SimulationResult;
    worst: SimulationResult;
}
