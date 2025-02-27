import { useState, useEffect } from 'react';
import { Asset } from '../types';
import ApiService from '../services/api';

export function useAssets() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAssets = async () => {
            setIsLoading(true);
            try {
                const data = await ApiService.getAssets();
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
