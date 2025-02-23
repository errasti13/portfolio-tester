import { useState, useEffect } from "react";
import { runSimulations } from './utils/simulationUtils';
import EnhancedChart from './components/EnhancedChart';
import ErrorBoundary from './components/ErrorBoundary';
import PortfolioControls from './components/PortfolioControls';
import SimulationControls from './components/SimulationControls';
import SimulationResults from './components/SimulationResults';

function App() {
    const [error, setError] = useState(null);
    const [assets, setAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [simulationYears, setSimulationYears] = useState(20);
    const [simulationResults, setSimulationResults] = useState(null);
    const [showSimulation, setShowSimulation] = useState(false);
    const [periodicInvestment, setPeriodicInvestment] = useState(500);
    const [investmentFrequency, setInvestmentFrequency] = useState('monthly');
    const [initialInvestment, setInitialInvestment] = useState(10000);
    const [portfolio, setPortfolio] = useState([{ assetId: 'SP500', allocation: 100 }]);
    const [portfolioData, setPortfolioData] = useState({});
    const [isRunningSimulation, setIsRunningSimulation] = useState(false);

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
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssets();
    }, []);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const results = {};
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
                setError(err.message);
            }
        };

        fetchPortfolioData();
    }, [portfolio]);

    const runSimulation = async () => {
        const totalAllocation = portfolio.reduce((sum, asset) => sum + asset.allocation, 0);
        if (totalAllocation !== 100) {
            setError('Total allocation must equal 100%');
            return;
        }
        if (!Object.keys(portfolioData).length) {
            setError('Waiting for asset data to load...');
            return;
        }

        setIsRunningSimulation(true);
        try {
            const results = await runSimulations(
                portfolioData,
                portfolio,
                simulationYears,
                initialInvestment,
                periodicInvestment,
                investmentFrequency
            );
            setSimulationResults(results);
            setShowSimulation(true);
            setError(null);
        } catch (err) {
            setError(err.message);
            setShowSimulation(false);
            setSimulationResults(null);
        } finally {
            setIsRunningSimulation(false);
        }
    };

    return (
        <ErrorBoundary>
            <div style={{ textAlign: "center", marginTop: "50px" }}>
                <h1>Portfolio Simulator</h1>
                {isLoading ? (
                    <div>Loading assets data...</div>
                ) : (
                    <>
                        {error && <div className="error-message">{error}</div>}
                        <div className="simulation-section">
                            <PortfolioControls
                                assets={assets}
                                portfolio={portfolio}
                                setPortfolio={setPortfolio}
                                totalAllocation={portfolio.reduce((sum, asset) => sum + asset.allocation, 0)}
                            />
                            <SimulationControls
                                initialInvestment={initialInvestment}
                                setInitialInvestment={setInitialInvestment}
                                simulationYears={simulationYears}
                                setSimulationYears={setSimulationYears}
                                periodicInvestment={periodicInvestment}
                                setPeriodicInvestment={setPeriodicInvestment}
                                investmentFrequency={investmentFrequency}
                                setInvestmentFrequency={setInvestmentFrequency}
                                runSimulation={runSimulation}
                                isRunningSimulation={isRunningSimulation}
                            />
                        </div>
                    </>
                )}
                {simulationResults && showSimulation && (
                    <>
                        <div className="sp500-section" style={{ margin: '2rem auto', maxWidth: '1200px' }}>
                            <h2>Simulation Results</h2>
                            <EnhancedChart simulationResults={simulationResults} />
                        </div>
                        <SimulationResults simulationResults={simulationResults} initialInvestment={initialInvestment} periodicInvestment={periodicInvestment} investmentFrequency={investmentFrequency} simulationYears={simulationYears} />
                    </>
                )}
            </div>
        </ErrorBoundary>
    );
}

export default App;
