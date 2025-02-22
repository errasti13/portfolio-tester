import { useState, useEffect } from "react";
import { runSimulations } from './utils/simulationUtils';
import EnhancedChart from './components/EnhancedChart';

function App() {
    const [error, setError] = useState(null);
    const [assets, setAssets] = useState([]);
    const [simulationYears, setSimulationYears] = useState(20);
    const [simulationResults, setSimulationResults] = useState(null);
    const [showSimulation, setShowSimulation] = useState(false);
    const [periodicInvestment, setPeriodicInvestment] = useState(500);
    const [investmentFrequency, setInvestmentFrequency] = useState('monthly');
    const [initialInvestment, setInitialInvestment] = useState(10000);
    const [portfolio, setPortfolio] = useState([
        { assetId: 'SP500', allocation: 100 }
    ]);
    const [portfolioData, setPortfolioData] = useState({});
    const [assetWarnings, setAssetWarnings] = useState({});

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/assets');
                if (!response.ok) throw new Error('Failed to fetch assets');
                const data = await response.json();
                setAssets(data);
            } catch (err) {
                console.error('Error fetching assets:', err);
                setError(err.message);
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

    const handleAllocationChange = (index, newAllocation) => {
        const updatedPortfolio = [...portfolio];
        updatedPortfolio[index].allocation = Number(newAllocation);
        setPortfolio(updatedPortfolio);
    };

    const addAsset = () => {
        if (portfolio.length >= 5) return; // Limit to 5 assets
        setPortfolio([...portfolio, { assetId: 'SP500', allocation: 0 }]);
    };

    const removeAsset = (index) => {
        const updatedPortfolio = portfolio.filter((_, i) => i !== index);
        setPortfolio(updatedPortfolio);
    };

    const totalAllocation = portfolio.reduce((sum, asset) => sum + asset.allocation, 0);

    const runSimulation = () => {
        if (totalAllocation !== 100) {
            setError('Total allocation must equal 100%');
            return;
        }
        if (!Object.keys(portfolioData).length) {
            setError('Waiting for asset data to load...');
            return;
        }
        
        try {
            const results = runSimulations(
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
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Portfolio Simulator</h1>
            
            {/* Portfolio Controls */}
            <div className="simulation-section">
                <div className="portfolio-controls">
                    <h3>Portfolio Allocation</h3>
                    {error && <div className="error-message">{error}</div>}
                    {portfolio.map((asset, index) => (
                        <div key={index} className="asset-allocation">
                            <div className="asset-selector">
                                <select 
                                    value={asset.assetId}
                                    onChange={(e) => {
                                        const updated = [...portfolio];
                                        updated[index].assetId = e.target.value;
                                        setPortfolio(updated);
                                    }}
                                >
                                    {assets.map(a => (
                                        <option key={a.id} value={a.id}>{a.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={asset.allocation}
                                    onChange={(e) => handleAllocationChange(index, e.target.value)}
                                    min="0"
                                    max="100"
                                    step="5"
                                />
                                <span>%</span>
                                {portfolio.length > 1 && (
                                    <button onClick={() => removeAsset(index)}>Remove</button>
                                )}
                            </div>
                            <div className="asset-warning" style={{
                                fontSize: '0.8em',
                                color: '#666',
                                marginTop: '4px',
                                fontStyle: 'italic'
                            }}>
                                {assets.find(a => a.id === asset.assetId)?.firstAvailableDate && (
                                    `Data available from: ${new Date(assets.find(a => a.id === asset.assetId).firstAvailableDate).getFullYear()}`
                                )}
                            </div>
                        </div>
                    ))}
                    {portfolio.length < 5 && (
                        <button onClick={addAsset}>Add Asset</button>
                    )}
                    <div className="total-allocation">
                        Total: {totalAllocation}%
                        {totalAllocation !== 100 && (
                            <span className="error"> (Must equal 100%)</span>
                        )}
                    </div>
                </div>

                <div className="simulation-controls">
                    <div className="control-group">
                        <label>Initial Investment ($):</label>
                        <input
                            type="number"
                            value={initialInvestment}
                            onChange={(e) => setInitialInvestment(Number(e.target.value))}
                            min="0"
                            step="1000"
                        />
                    </div>
                    <div className="control-group">
                        <label>Investment Period (Years):</label>
                        <input
                            type="number"
                            value={simulationYears}
                            onChange={(e) => setSimulationYears(Number(e.target.value))}
                            min="1"
                            max="30"
                        />
                    </div>
                    <div className="control-group">
                        <label>Periodic Investment ($):</label>
                        <input
                            type="number"
                            value={periodicInvestment}
                            onChange={(e) => setPeriodicInvestment(Number(e.target.value))}
                            min="0"
                            step="100"
                        />
                    </div>
                    <div className="control-group">
                        <label>Investment Frequency:</label>
                        <select 
                            value={investmentFrequency}
                            onChange={(e) => setInvestmentFrequency(e.target.value)}
                        >
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                    <button onClick={runSimulation}>Run Simulation</button>
                </div>
            </div>

            {/* Chart Section */}
            {simulationResults && (
                <div className="sp500-section" style={{ margin: '2rem auto', maxWidth: '1200px' }}>
                    <h2>Simulation Results</h2>
                    <EnhancedChart simulationResults={simulationResults} />
                </div>
            )}

            {/* Results Section */}
            {simulationResults && showSimulation && (
                <div className="results-summary">
                    <h3>Simulation Results</h3>
                    <div className="investment-summary">
                        <h4>📊 Investment Parameters</h4>
                        <div className="parameters-grid">
                            <p><span className="label">Initial Investment:</span> <span className="value">${initialInvestment.toLocaleString()}</span></p>
                            <p><span className="label">Periodic Investment:</span> <span className="value">${periodicInvestment.toLocaleString()} ({investmentFrequency})</span></p>
                            <p><span className="label">Investment Period:</span> <span className="value">{simulationYears} years</span></p>
                            <p><span className="label">Total Amount Invested:</span> <span className="value">${simulationResults.best.totalInvested.toLocaleString()}</span></p>
                        </div>
                    </div>
                    
                    <div className="scenarios">
                        <div className="best-case">
                            <h4>Best Case Scenario</h4>
                            <ul>
                                <li><span className="label">Total Return</span> <span className="value">{simulationResults.best.return.toFixed(2)}%</span></li>
                                <li><span className="label">Annualized Return</span> <span className="value">{simulationResults.best.annualizedReturn.toFixed(2)}%</span></li>
                                <li><span className="label">Final Value</span> <span className="value">${simulationResults.best.finalValue.toLocaleString()}</span></li>
                                <li><span className="label">Net Profit</span> <span className="value">${(simulationResults.best.finalValue - simulationResults.best.totalInvested).toLocaleString()}</span></li>
                                <li><span className="label">Period</span> <span className="value">{simulationResults.best.startDate.toLocaleDateString()} - {simulationResults.best.endDate.toLocaleDateString()}</span></li>
                            </ul>
                        </div>
                        
                        <div className="median-case">
                            <h4>Median Case Scenario</h4>
                            <ul>
                                <li>Total Return: {simulationResults.median.return.toFixed(2)}%</li>
                                <li>Annualized Return: {simulationResults.median.annualizedReturn.toFixed(2)}%</li>
                                <li>Final Portfolio Value: ${simulationResults.median.finalValue.toLocaleString()}</li>
                                <li>Net Profit: ${(simulationResults.median.finalValue - simulationResults.median.totalInvested).toLocaleString()}</li>
                                <li>Period: {simulationResults.median.startDate.toLocaleDateString()} - {simulationResults.median.endDate.toLocaleDateString()}</li>
                            </ul>
                        </div>
                        
                        <div className="worst-case">
                            <h4>Worst Case Scenario:</h4>
                            <ul>
                                <li>Total Return: {simulationResults.worst.return.toFixed(2)}%</li>
                                <li>Annualized Return: {simulationResults.worst.annualizedReturn.toFixed(2)}%</li>
                                <li>Final Portfolio Value: ${simulationResults.worst.finalValue.toLocaleString()}</li>
                                <li>Net Profit: ${(simulationResults.worst.finalValue - simulationResults.worst.totalInvested).toLocaleString()}</li>
                                <li>Period: {simulationResults.worst.startDate.toLocaleDateString()} - {simulationResults.worst.endDate.toLocaleDateString()}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
