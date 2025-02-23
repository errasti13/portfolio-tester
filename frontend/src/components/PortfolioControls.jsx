function PortfolioControls({ assets, portfolio, setPortfolio, totalAllocation }) {
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

    return (
        <div className="portfolio-controls">
            <h3>Portfolio Allocation</h3>
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
    );
}

export default PortfolioControls;
