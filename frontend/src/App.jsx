import { useState, useEffect } from "react";
import { Line } from 'react-chartjs-2';
import { runSimulations } from './utils/simulationUtils';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

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

    const combinedChartData = {
        labels: showSimulation && simulationResults 
            ? simulationResults.best.data.map(day => new Date(day.date).toLocaleDateString())
            : (sp500Data ? sp500Data.map(day => new Date(day.date).toLocaleDateString()) : []),
        datasets: showSimulation && simulationResults ? [
            {
                label: 'Best Case Portfolio Value',
                data: simulationResults.best.data.map(day => day.value),
                borderColor: 'rgb(75, 192, 75)',
                tension: 0.1
            },
            {
                label: 'Worst Case Portfolio Value',
                data: simulationResults.worst.data.map(day => day.value),
                borderColor: 'rgb(192, 75, 75)',
                tension: 0.1
            },
            {
                label: 'Median Case Portfolio Value',
                data: simulationResults.median.data.map(day => day.value),
                borderColor: 'rgb(75, 75, 192)',
                tension: 0.1
            }
        ] : [
            {
                label: 'S&P 500 Index',
                data: sp500Data ? sp500Data.map(day => day.close) : [],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'S&P 500 Historical Trend'
            }
        },
        scales: {
            y: {
                beginAtZero: false
            }
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>S&P 500 Historical Analysis</h1>
            
            {/* Main Chart Section */}
            <div className="sp500-section">
                <h2>{showSimulation ? 'Simulation Results' : 'Historical Data'}</h2>
                <div className="chart-container" style={{ marginBottom: '40px' }}>
                    <Line data={combinedChartData} options={chartOptions} />
                    {showSimulation && (
                        <button 
                            onClick={() => setShowSimulation(false)}
                            style={{ marginTop: '10px' }}
                        >
                            Back to Historical View
                        </button>
                    )}
                </div>
            </div>

            {/* Updated Simulation Controls */}
            <div className="simulation-section">
                <h2>Investment Simulator</h2>
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
                
                {simulationResults && showSimulation && (
                    <div className="results-summary">
                        <h3>Simulation Results</h3>
                        <div className="investment-summary">
                            <h4>Investment Summary</h4>
                            <p>Initial Investment: ${initialInvestment.toLocaleString()}</p>
                            <p>Periodic Investment: ${periodicInvestment.toLocaleString()} ({investmentFrequency})</p>
                            <p>Investment Period: {simulationYears} years</p>
                            <p>Total Amount Invested: ${simulationResults.best.totalInvested.toLocaleString()}</p>
                        </div>
                        
                        <div className="scenarios">
                            <div className="best-case">
                                <h4>Best Case Scenario:</h4>
                                <ul>
                                    <li>Total Return: {simulationResults.best.return.toFixed(2)}%</li>
                                    <li>Annualized Return: {simulationResults.best.annualizedReturn.toFixed(2)}%</li>
                                    <li>Final Portfolio Value: ${simulationResults.best.finalValue.toLocaleString()}</li>
                                    <li>Net Profit: ${(simulationResults.best.finalValue - simulationResults.best.totalInvested).toLocaleString()}</li>
                                    <li>Period: {simulationResults.best.startDate.toLocaleDateString()} - {simulationResults.best.endDate.toLocaleDateString()}</li>
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
        </div>
    );
}

export default App;
