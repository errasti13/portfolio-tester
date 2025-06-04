import { Asset, PortfolioAsset } from '../types';

// Auto-detect if we're using different hosting platforms and adjust API URL accordingly
const getApiBaseUrl = () => {
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // Check for environment variable first (most reliable for production)
    if (import.meta.env.VITE_API_URL) {
        console.log('Using VITE_API_URL:', import.meta.env.VITE_API_URL);
        return import.meta.env.VITE_API_URL;
    }
    
    // If deployed on GitHub Pages - use local network backend 
    if (hostname.includes('github.io') || hostname.includes('pages.dev') || hostname.includes('netlify.app') || hostname.includes('vercel.app')) {
        console.log('Detected static hosting platform, using local network API');
        return 'http://192.168.1.134:5000/api';
    }
    
    // If using localtunnel domains (development)
    if (hostname.includes('loca.lt')) {
        console.log('Detected localtunnel, using localtunnel API');
        return 'https://portfolio-api.loca.lt/api';
    }
    
    // If on localhost (development), use local backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        console.log('Detected localhost, using local API');
        return 'http://localhost:5000/api';
    }
    
    // If on local network IP, use local network backend
    if (hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
        console.log('Detected local network access, using local network API');
        return 'http://192.168.1.134:5000/api';
    }
    
    // Fallback to local network API for external access
    console.log('Using local network API for external access');
    return 'http://192.168.1.134:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
    private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        console.log(`Making API request to: ${API_BASE_URL}${endpoint}`); // Debug log
        
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const error = await response.json();
                    errorMessage = error.message || errorMessage;
                } catch (e) {
                    // If response is not JSON, use the status text
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }

            return response.json();
        } catch (error) {
            console.error('API request failed:', error);
            
            // If we're on GitHub Pages and can't reach the API, show helpful message
            if (window.location.hostname.includes('github.io') && error instanceof TypeError) {
                throw new Error('Backend not accessible! Please start your backend with localtunnel: run start-with-localtunnel.bat');
            }
            
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('An unexpected error occurred');
        }
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