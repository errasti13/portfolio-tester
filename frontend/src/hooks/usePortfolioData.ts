import { useState, useEffect } from 'react';
import { PortfolioAsset } from '../types';
import ApiService from '../services/api';

export function usePortfolioData(portfolio: PortfolioAsset[]) {
    const [portfolioData, setPortfolioData] = useState<Record<string, any>>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const results = await ApiService.getPortfolioData(portfolio);
                setPortfolioData(results);
            } catch (err) {
                console.error('Error fetching portfolio data:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
            }
        };

        fetchPortfolioData();
    }, [portfolio]);

    return { portfolioData, error };
}
