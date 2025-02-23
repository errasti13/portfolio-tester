import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EnhancedChart = ({ simulationResults }) => {
    if (!simulationResults) return null;

    console.log('Simulation Results:', simulationResults);

    // Prepare data for the chart
    const prepareChartData = () => {
        const bestCase = simulationResults.best?.data || [];
        const medianCase = simulationResults.median?.data || [];
        const worstCase = simulationResults.worst?.data || [];

        return bestCase.map((point, index) => ({
            year: Math.floor(index / 12),  // Convert month index to year
            Best: Math.round(point.value),
            Median: Math.round(medianCase[index]?.value || 0),
            Worst: Math.round(worstCase[index]?.value || 0)
        }));
    };

    const data = prepareChartData();
    console.log('Prepared Chart Data:', data);

    const formatYAxis = (value) => {
        if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `$${(value / 1000).toFixed(0)}K`;
        }
        return `$${value}`;
    };

    const formatTooltip = (value) => {
        return `$${value.toLocaleString()}`;
    };

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="year" 
                        label={{ 
                            value: 'Years', 
                            position: 'insideBottom', 
                            offset: -5 
                        }}
                        tickFormatter={(value) => Math.floor(value)}
                    />
                    <YAxis 
                        tickFormatter={formatYAxis}
                        label={{ 
                            value: 'Portfolio Value', 
                            angle: -90, 
                            position: 'insideLeft'
                        }}
                    />
                    <Tooltip 
                        formatter={formatTooltip}
                        labelFormatter={(label) => `Month ${label}`}
                    />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="Best" 
                        stroke="#4CAF50" 
                        dot={false} 
                        strokeWidth={2}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="Median" 
                        stroke="#2196F3" 
                        dot={false} 
                        strokeWidth={2}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="Worst" 
                        stroke="#F44336" 
                        dot={false} 
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EnhancedChart;
