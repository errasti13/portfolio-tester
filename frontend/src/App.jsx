import { useState, useEffect } from "react";

function App() {
    const [stock, setStock] = useState(null);
    const [symbol, setSymbol] = useState("AAPL");

    useEffect(() => {
        fetch(`http://localhost:5000/api/stocks/${symbol}`)
            .then((res) => res.json())
            .then((data) => setStock(data))
            .catch((err) => console.error("Error fetching stock:", err));
    }, [symbol]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Financial Planner</h1>
            <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="Enter stock symbol"
            />
            {stock ? (
                <div>
                    <h2>{stock.symbol}</h2>
                    <p>Price: ${stock.price}</p>
                    <p>High: ${stock.high}</p>
                    <p>Low: ${stock.low}</p>
                    <p>Open: ${stock.open}</p>
                    <p>Prev Close: ${stock.prevClose}</p>
                </div>
            ) : (
                <p>Loading stock data...</p>
            )}
        </div>
    );
}

export default App;
