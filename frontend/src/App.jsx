import { useState, useEffect } from "react";
import { runSimulations } from './utils/simulationUtils';
import EnhancedChart from './components/EnhancedChart';

function App() {
    const [error, setError] = useState(null);
    const [sp500Data, setSp500Data] = useState(null);
    const [simulationYears, setSimulationYears] = useState(20);
    const [simulationResults, setSimulationResults] = useState(null);
    const [showSimulation, setShowSimulation] = useState(false);
    const [periodicInvestment, setPeriodicInvestment] = useState(500);
    const [investmentFrequency, setInvestmentFrequency] = useState('monthly');
    const [initialInvestment, setInitialInvestment] = useState(10000);

    useEffect(() => {
        const fetchSP500History = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/sp500/history');
                if (!response.ok) {
                    throw new Error('Failed to fetch S&P 500 data');
                }
                const data = await response.json();
                setSp500Data(data);
            } catch (err) {
                console.error('Error fetching S&P 500 data:', err);
                setError(err.message);
            }
        };

        fetchSP500History();
    }, []);

    const runSimulation = () => {
        if (!sp500Data) return;
        const results = runSimulations(sp500Data, simulationYears, initialInvestment, periodicInvestment, investmentFrequency);
        setSimulationResults(results);
        setShowSimulation(true);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>S&P 500 Investment Simulator</h1>
            
            {/* Simulation Controls */}
            <div className="simulation-section" style={{ borderTop: 'none' }}>
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
                                <li>
                                    <span className="label">Total Return</span>
                                    <span className="value">{simulationResults.best.return.toFixed(2)}%</span>
                                </li>
                                <li>
                                    <span className="label">Annualized Return</span>
                                    <span className="value">{simulationResults.best.annualizedReturn.toFixed(2)}%</span>
                                </li>
                                <li>
                                    <span className="label">Final Value</span>
                                    <span className="value">${simulationResults.best.finalValue.toLocaleString()}</span>
                                </li>
                                <li>
                                    <span className="label">Net Profit</span>
                                    <span className="value">${(simulationResults.best.finalValue - simulationResults.best.totalInvested).toLocaleString()}</span>
                                </li>
                                <li>
                                    <span className="label">Period</span>
                                    <span className="value">{simulationResults.best.startDate.toLocaleDateString()} - {simulationResults.best.endDate.toLocaleDateString()}</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="median-case">
                            <h4>Median Case Scenario:</h4>
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
