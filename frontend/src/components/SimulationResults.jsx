function SimulationResults({ simulationResults, initialInvestment, periodicInvestment, investmentFrequency, simulationYears }) {
    return (
        <div className="results-summary">
            <h3>Simulation Results</h3>
            <div className="investment-summary">
                <h4>📊 Investment Parameters</h4>
                <div className="parameters-grid">
                    <p><span className="label">Initial Investment:</span> <span className="value">${initialInvestment.toLocaleString()}</span></p>
                    <p><span className="label">Periodic Investment:</span> <span className="value">${periodicInvestment.toLocaleString()} ({investmentFrequency})</span></p>
                    <p><span className="label">Investment Period:</span> <span className="value">{simulationYears} years</span></p>
                    <p><span className="label">Total Amount Invested:</span> <span className="value">${simulationResults?.best?.totalInvested?.toLocaleString() || 'N/A'}</span></p>
                </div>
            </div>
            
            <div className="scenarios">
                {simulationResults?.best && (
                    <div className="best-case">
                        <h4>Best Case Scenario</h4>
                        <ul>
                            <li><span className="label">Total Return</span> <span className="value">{simulationResults.best.return?.toFixed(2) || 'N/A'}%</span></li>
                            <li><span className="label">Annualized Return</span> <span className="value">{simulationResults.best.annualizedReturn?.toFixed(2) || 'N/A'}%</span></li>
                            <li><span className="label">Final Value</span> <span className="value">${simulationResults.best.finalValue?.toLocaleString() || 'N/A'}</span></li>
                            <li><span className="label">Net Profit</span> <span className="value">${(simulationResults.best.finalValue - simulationResults.best.totalInvested)?.toLocaleString() || 'N/A'}</span></li>
                            <li><span className="label">Period</span> <span className="value">{simulationResults.best.startDate?.toLocaleDateString() || 'N/A'} - {simulationResults.best.endDate?.toLocaleDateString() || 'N/A'}</span></li>
                        </ul>
                    </div>
                )}
                
                {simulationResults?.median && (
                    <div className="median-case">
                        <h4>Median Case Scenario</h4>
                        <ul>
                            <li>Total Return: {simulationResults.median.return?.toFixed(2) || 'N/A'}%</li>
                            <li>Annualized Return: {simulationResults.median.annualizedReturn?.toFixed(2) || 'N/A'}%</li>
                            <li>Final Portfolio Value: ${simulationResults.median.finalValue?.toLocaleString() || 'N/A'}</li>
                            <li>Net Profit: ${(simulationResults.median.finalValue - simulationResults.median.totalInvested)?.toLocaleString() || 'N/A'}</li>
                            <li>Period: {simulationResults.median.startDate?.toLocaleDateString() || 'N/A'} - {simulationResults.median.endDate?.toLocaleDateString() || 'N/A'}</li>
                        </ul>
                    </div>
                )}
                
                {simulationResults?.worst && (
                    <div className="worst-case">
                        <h4>Worst Case Scenario:</h4>
                        <ul>
                            <li>Total Return: {simulationResults.worst.return?.toFixed(2) || 'N/A'}%</li>
                            <li>Annualized Return: {simulationResults.worst.annualizedReturn?.toFixed(2) || 'N/A'}%</li>
                            <li>Final Portfolio Value: ${simulationResults.worst.finalValue?.toLocaleString() || 'N/A'}</li>
                            <li>Net Profit: ${(simulationResults.worst.finalValue - simulationResults.worst.totalInvested)?.toLocaleString() || 'N/A'}</li>
                            <li>Period: {simulationResults.worst.startDate?.toLocaleDateString() || 'N/A'} - {simulationResults.worst.endDate?.toLocaleDateString() || 'N/A'}</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SimulationResults;
