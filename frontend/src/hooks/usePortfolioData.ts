import { useState, useEffect } from 'react';
import { PortfolioAsset } from '../types';

export function usePortfolioData(portfolio: PortfolioAsset[]) {
    const [portfolioData, setPortfolioData] = useState<Record<string, any>>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const results: Record<string, any> = {};
                for (const item of portfolio) {
                    const response = await fetch(`http://localhost:5000/api/asset/${item.assetId}/history`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${item.assetId} data`);
                    }
                    results[item.assetId] = await response.json();
                }
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
