function SimulationControls({
    initialInvestment,
    setInitialInvestment,
    simulationYears,
    setSimulationYears,
    periodicInvestment,
    setPeriodicInvestment,
    investmentFrequency,
    setInvestmentFrequency,
    runSimulation,
    isRunningSimulation
}) {
    return (
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
            <button onClick={runSimulation} disabled={isRunningSimulation}>
                {isRunningSimulation ? 'Running...' : 'Run Simulation'}
            </button>
        </div>
    );
}

export default SimulationControls;
