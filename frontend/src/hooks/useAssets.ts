import { useState, useEffect } from 'react';
import { Asset } from '../types';

export function useAssets() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAssets = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/assets');
                if (!response.ok) throw new Error('Failed to fetch assets');
                const data = await response.json();
                setAssets(data);
            } catch (err) {
                console.error('Error fetching assets:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch assets');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssets();
    }, []);

    return { assets, isLoading, error };
}
