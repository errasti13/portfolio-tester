import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Typography, Box, Grid, Paper, Divider } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const EnhancedChart = ({ simulationResults }) => {
    if (!simulationResults) return null;

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

    const renderScenarioCard = (scenario, title, color) => (
        <Grid item xs={12} md={4}>
            <Paper 
                sx={{ 
                    p: 3, 
                    height: '100%',
                    bgcolor: '#2a2a2a', 
                    borderLeft: `4px solid ${color}`,
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5
                }}
            >
                <Typography variant="h6" sx={{ color, mb: 1, fontWeight: 'bold' }}>
                    {title}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">Final Portfolio Value</Typography>
                    <Typography variant="h6" sx={{ color: '#fff' }}>
                        ${scenario.finalValue?.toLocaleString()}
                    </Typography>
                </Box>

                <Divider sx={{ my: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Total Return</Typography>
                    <Typography sx={{ color: scenario.return >= 0 ? '#4caf50' : '#f44336' }}>
                        {scenario.return?.toFixed(2)}%
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Annualized Return</Typography>
                    <Typography sx={{ color: scenario.annualizedReturn >= 0 ? '#4caf50' : '#f44336' }}>
                        {scenario.annualizedReturn?.toFixed(2)}%
                    </Typography>
                </Box>

                <Divider sx={{ my: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Total Invested</Typography>
                    <Typography>${scenario.totalInvested?.toLocaleString()}</Typography>
                </Box>

                {scenario.totalWithdrawn > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Total Withdrawn</Typography>
                        <Typography>${scenario.totalWithdrawn?.toLocaleString()}</Typography>
                    </Box>
                )}

                {scenario.portfolioDepletionMonth && (
                    <Box 
                        sx={{ 
                            mt: 'auto',
                            p: 1.5, 
                            bgcolor: 'rgba(244, 67, 54, 0.1)', 
                            borderRadius: 1,
                            border: '1px solid rgba(244, 67, 54, 0.3)'
                        }}
                    >
                        <Typography color="error" variant="body2">
                            Portfolio depleted in year {Math.floor(scenario.portfolioDepletionMonth / 12)}
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Grid>
    );

    return (
        <Card sx={{ p: 3, borderRadius: 2, boxShadow: 4, bgcolor: '#1e1e1e', color: '#ffffff' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#ffffff', mb: 3 }}>
                Portfolio Simulation Results
            </Typography>

            {/* Chart */}
            <Box sx={{ width: '100%', height: 400, mb: 4 }}>
                <ResponsiveContainer>
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 40, bottom: 20 }}
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
                                offset: -10,
                                fill: '#ffffff',
                                dy: 10
                            }}
                            tick={{ fill: '#ffffff', dy: 5 }}
                        />
                        <YAxis 
                            tickFormatter={formatYAxis}
                            label={{ 
                                value: 'Portfolio Value', 
                                angle: -90, 
                                position: 'insideLeft',
                                offset: -30,
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
                            height={36}
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

            {/* Scenario Cards */}
            <Grid container spacing={3}>
                {simulationResults?.best && renderScenarioCard(simulationResults.best, 'Best Case Scenario', '#4CAF50')}
                {simulationResults?.median && renderScenarioCard(simulationResults.median, 'Median Case Scenario', '#2196F3')}
                {simulationResults?.worst && renderScenarioCard(simulationResults.worst, 'Worst Case Scenario', '#F44336')}
            </Grid>

            {simulationResults.successRate < 100 && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(244, 67, 54, 0.1)', borderRadius: 1 }}>
                    <Typography color="error">
                        Warning: In {(100 - simulationResults.successRate).toFixed(1)}% of simulations, 
                        the portfolio was depleted before the end of the simulation period.
                    </Typography>
                </Box>
            )}
        </Card>
    );
};

export default EnhancedChart;
