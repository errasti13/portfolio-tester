import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Typography, Box, Grid, Paper } from '@mui/material';

const EnhancedChart = ({ simulationResults }) => {
    if (!simulationResults) return null;

    console.log('Simulation Results:', simulationResults);

    const prepareChartData = () => {
        const bestCase = simulationResults.best?.data || [];
        const medianCase = simulationResults.median?.data || [];
        const worstCase = simulationResults.worst?.data || [];

        return bestCase.map((point, index) => ({
            monthIndex: index,
            Best: Math.round(point.value),
            Median: Math.round(medianCase[index]?.value || 0),
            Worst: Math.round(worstCase[index]?.value || 0)
        }));
    };

    const data = prepareChartData();
    const yearlyTicks = data.filter(d => d.monthIndex % 12 === 0).map(d => d.monthIndex);
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
            </Box>

            {/* Simulation Results Section */}
            <Paper sx={{ mt: 3, p: 2, bgcolor: '#2a2a2a', color: '#ffffff' }}>
                <Typography variant="h6" gutterBottom>
                    Simulation Results
                </Typography>
                <Grid container spacing={2}>
                    {simulationResults?.best && (
                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle1">Best Case</Typography>
                            <Typography>Total Return: {simulationResults.best.return?.toFixed(2)}%</Typography>
                            <Typography>Annualized Return: {simulationResults.best.annualizedReturn?.toFixed(2)}%</Typography>
                            <Typography>Final Value: ${simulationResults.best.finalValue?.toLocaleString()}</Typography>
                        </Grid>
                    )}
                    {simulationResults?.median && (
                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle1">Median Case</Typography>
                            <Typography>Total Return: {simulationResults.median.return?.toFixed(2)}%</Typography>
                            <Typography>Annualized Return: {simulationResults.median.annualizedReturn?.toFixed(2)}%</Typography>
                            <Typography>Final Value: ${simulationResults.median.finalValue?.toLocaleString()}</Typography>
                        </Grid>
                    )}
                    {simulationResults?.worst && (
                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle1">Worst Case</Typography>
                            <Typography>Total Return: {simulationResults.worst.return?.toFixed(2)}%</Typography>
                            <Typography>Annualized Return: {simulationResults.worst.annualizedReturn?.toFixed(2)}%</Typography>
                            <Typography>Final Value: ${simulationResults.worst.finalValue?.toLocaleString()}</Typography>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Card>
    );
};

export default EnhancedChart;
