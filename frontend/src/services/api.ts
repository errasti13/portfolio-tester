import { Asset, PortfolioAsset } from '../types';

// Auto-detect if we're using localtunnel and adjust API URL accordingly
const getApiBaseUrl = () => {
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // If deployed on GitHub Pages (or similar static hosting)
    if (hostname.includes('github.io') || hostname.includes('pages.dev') || hostname.includes('netlify.app') || hostname.includes('vercel.app')) {
        // Use your deployed backend API URL here
        // For example: return 'https://your-backend.railway.app/api';
        return import.meta.env.VITE_API_URL || 'https://portfolio-api.loca.lt/api';
    }
    
    // If using localtunnel domains
    if (hostname.includes('loca.lt')) {
        return 'https://portfolio-api.loca.lt/api';
    }
    
    // If on localhost (ports 3000 or 3001), use local backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }
    
    return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
    private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        console.log(`Making API request to: ${API_BASE_URL}${endpoint}`); // Debug log
        
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