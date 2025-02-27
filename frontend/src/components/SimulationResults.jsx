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
                        margin={{ top: 5, right: 30, left: 40, bottom: 20 }}  // Increased bottom margin
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
                                offset: -10,  // Adjusted offset
                                fill: '#ffffff',
                                dy: 10  // Move label down
                            }}
                            tick={{ fill: '#ffffff', dy: 5 }}  // Move ticks down
                        />
                        <YAxis 
                            tickFormatter={formatYAxis}
                            label={{ 
                                value: 'Portfolio Value', 
                                angle: -90, 
                                position: 'insideLeft',
                                offset: -30,  // Add offset to move label away from ticks
                                fill: '#ffffff' 
                            }}
                            tick={{ fill: '#ffffff' }}
                        />
                        <Tooltip 
                            formatter={formatTooltip}
                            labelFormatter={(monthIndex) => `Year ${Math.floor(monthIndex / 12)}`}
                            contentStyle={{ backgroundColor: '#333', color: '#ffffff' }}
                        />
                        <Legend 
                            wrapperStyle={{ color: '#ffffff' }}
                            verticalAlign="top"
                            height={36}  // Add height to create space
                        />
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
                            <Typography variant="subtitle1" sx={{ color: '#4CAF50', mb: 1 }}>Best Case</Typography>
                            <Typography>Total Return: {simulationResults.best.return?.toFixed(2)}%</Typography>
                            <Typography>Annualized Return: {simulationResults.best.annualizedReturn?.toFixed(2)}%</Typography>
                            <Typography>Final Value: ${simulationResults.best.finalValue?.toLocaleString()}</Typography>
                            <Typography>Total Invested: ${simulationResults.best.totalInvested?.toLocaleString()}</Typography>
                            {simulationResults.best.totalWithdrawn > 0 && (
                                <Typography>Total Withdrawn: ${simulationResults.best.totalWithdrawn?.toLocaleString()}</Typography>
                            )}
                        </Grid>
                    )}
                    {simulationResults?.median && (
                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle1" sx={{ color: '#2196F3', mb: 1 }}>Median Case</Typography>
                            <Typography>Total Return: {simulationResults.median.return?.toFixed(2)}%</Typography>
                            <Typography>Annualized Return: {simulationResults.median.annualizedReturn?.toFixed(2)}%</Typography>
                            <Typography>Final Value: ${simulationResults.median.finalValue?.toLocaleString()}</Typography>
                            <Typography>Total Invested: ${simulationResults.median.totalInvested?.toLocaleString()}</Typography>
                            {simulationResults.median.totalWithdrawn > 0 && (
                                <Typography>Total Withdrawn: ${simulationResults.median.totalWithdrawn?.toLocaleString()}</Typography>
                            )}
                        </Grid>
                    )}
                    {simulationResults?.worst && (
                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle1" sx={{ color: '#F44336', mb: 1 }}>Worst Case</Typography>
                            <Typography>Total Return: {simulationResults.worst.return?.toFixed(2)}%</Typography>
                            <Typography>Annualized Return: {simulationResults.worst.annualizedReturn?.toFixed(2)}%</Typography>
                            <Typography>Final Value: ${simulationResults.worst.finalValue?.toLocaleString()}</Typography>
                            <Typography>Total Invested: ${simulationResults.worst.totalInvested?.toLocaleString()}</Typography>
                            {simulationResults.worst.totalWithdrawn > 0 && (
                                <Typography>Total Withdrawn: ${simulationResults.worst.totalWithdrawn?.toLocaleString()}</Typography>
                            )}
                        </Grid>
                    )}
                </Grid>
                {simulationResults?.worst?.finalValue < 0 && (
                    <Typography 
                        color="error" 
                        sx={{ 
                            mt: 2, 
                            p: 2, 
                            bgcolor: 'rgba(244, 67, 54, 0.1)', 
                            borderRadius: 1,
                            border: '1px solid rgba(244, 67, 54, 0.3)'
                        }}
                    >
                        Warning: In some scenarios, the withdrawal rate may deplete the portfolio.
                    </Typography>
                )}
            </Paper>
        </Card>
    );
};

export default EnhancedChart;
