export interface Asset {
    id: string;
    name: string;
    firstAvailableDate: string;
}

export interface PortfolioAsset {
    assetId: string;
    allocation: number;
}

export interface SimulationScenario {
    return: number;
    annualizedReturn: number;
    finalValue: number;
    totalInvested: number;
    startDate: Date;
    endDate: Date;
}

export interface SimulationResults {
    best: SimulationScenario;
    median: SimulationScenario;
    worst: SimulationScenario;
    timeSeriesData: Array<{
        date: Date;
        value: number;
    }>;
}

export type InvestmentFrequency = 'monthly' | 'yearly';
