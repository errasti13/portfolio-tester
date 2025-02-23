import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Typography, Box } from '@mui/material';

const EnhancedChart = ({ simulationResults }) => {
    if (!simulationResults) return null;

    const prepareChartData = () => {
        const bestCase = simulationResults.best?.data || [];
        const medianCase = simulationResults.median?.data || [];
        const worstCase = simulationResults.worst?.data || [];
        // Preserve all data points and add a unique monthIndex
        return bestCase.map((point, index) => ({
            monthIndex: index,
            Best: Math.round(point.value),
            Median: Math.round(medianCase[index]?.value || 0),
            Worst: Math.round(worstCase[index]?.value || 0)
        }));
    };

    const data = prepareChartData();
    // Compute ticks for only the first month of each year
    const yearlyTicks = data.filter(d => d.monthIndex % 12 === 0).map(d => d.monthIndex);

    const formatYAxis = (value) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
        return `$${value}`;
    };

    const formatTooltip = (value) => `$${value.toLocaleString()}`;

    return (
        <Card sx={{ p: 3, borderRadius: 2, boxShadow: 4, bgcolor: '#1e1e1e', color: '#ffffff' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                Portfolio Simulation
            </Typography>
            <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis 
                            type="number"
                            dataKey="monthIndex"
                            domain={['dataMin', 'dataMax']}
                            ticks={yearlyTicks}
                            tickFormatter={(tick) => Math.floor(tick / 12)}
                            label={{ 
                                value: 'Years', 
                                position: 'insideBottom', 
                                offset: -5, 
                                fill: '#ffffff' 
                            }}
                            tick={{ fill: '#ffffff' }}
                        />
                        <YAxis 
                            tickFormatter={formatYAxis}
                            label={{ 
                                value: 'Portfolio Value', 
                                angle: -90, 
                                position: 'insideLeft', 
                                fill: '#ffffff' 
                            }}
                            tick={{ fill: '#ffffff' }}
                        />
                        <Tooltip 
                            formatter={formatTooltip}
                            labelFormatter={(label) => `Year ${label}`}
                            contentStyle={{ backgroundColor: '#333', color: '#ffffff' }}
                        />
                        <Legend wrapperStyle={{ color: '#ffffff' }} />
                        <Line type="monotone" dataKey="Best" stroke="#4CAF50" dot={false} strokeWidth={2} />
                        <Line type="monotone" dataKey="Median" stroke="#2196F3" dot={false} strokeWidth={2} />
                        <Line type="monotone" dataKey="Worst" stroke="#F44336" dot={false} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Card>
    );
};

export default EnhancedChart;