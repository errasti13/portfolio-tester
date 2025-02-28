import { Asset, PortfolioAsset } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
    private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'An error occurred');
        }

        return response.json();
    }

    public static async getAssets(): Promise<Asset[]> {
        return this.request<Asset[]>('/assets');
    }

    public static async getAssetHistory(assetId: string): Promise<any[]> {
        return this.request<any[]>(`/asset/${assetId}/history`);
    }

    public static async getHistoricalData(startDate: string, endDate: string, assetId: string): Promise<any[]> {
        return this.request<any[]>(`/historical-data?startDate=${startDate}&endDate=${endDate}&assetId=${assetId}`);
    }

    public static async getPortfolioData(portfolio: PortfolioAsset[]): Promise<Record<string, any>> {
        const results: Record<string, any> = {};
        for (const item of portfolio) {
            results[item.assetId] = await this.getAssetHistory(item.assetId);
        }
        return results;
    }
}

export default ApiService; 