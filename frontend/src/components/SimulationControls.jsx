import { useState } from 'react';
import {
    Grid,
    Button,
    Select,
    MenuItem,
    TextField,
    Card,
    Typography,
    Box,
} from '@mui/material';

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
    const handleNumberInput = (value, setter) => {
        // Allow any string input including negative sign
        if (value === '-') {
            setter(value);
        } else if (value === '') {
            setter('');
        } else {
            // Only validate if it's a complete number
            const numValue = Number(value);
            if (!isNaN(numValue)) {
                setter(value); // Keep as string to maintain cursor position
            }
        }
    };

    return (
        <Card 
            elevation={8}
            sx={{ 
                p: 4, 
                borderRadius: 3,
                position: 'relative',
                overflow: 'visible',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 3,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    pointerEvents: 'none'
                }
            }}
        >
            <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                    mb: 3,
                    background: 'linear-gradient(45deg, #2196F3, #64B5F6)',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}
            >
                Simulation Controls
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Initial Investment ($)"
                        type="text"
                        value={initialInvestment}
                        onChange={(e) => handleNumberInput(e.target.value, setInitialInvestment)}
                        placeholder="Enter amount..."
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'text.secondary',
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Investment Period (Years)"
                        type="text"
                        value={simulationYears}
                        onChange={(e) => handleNumberInput(e.target.value, setSimulationYears)}
                        placeholder="Enter years..."
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'text.secondary',
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Periodic Investment/Withdrawal ($)"
                        type="text"
                        value={periodicInvestment}
                        onChange={(e) => handleNumberInput(e.target.value, setPeriodicInvestment)}
                        placeholder="Enter amount (negative for withdrawal)..."
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'text.secondary',
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select
                        fullWidth
                        value={investmentFrequency}
                        onChange={(e) => setInvestmentFrequency(e.target.value)}
                        sx={{ 
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'text.secondary',
                            }
                        }}
                    >
                        <MenuItem value="monthly">Monthly</MenuItem>
                        <MenuItem value="yearly">Yearly</MenuItem>
                    </Select>
                </Grid>
            </Grid>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button 
                    onClick={runSimulation} 
                    disabled={isRunningSimulation}
                    variant="contained"
                    size="large"
                    sx={{
                        px: 4,
                        py: 1.5,
                        background: 'linear-gradient(45deg, #2196F3, #64B5F6)',
                        boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #1976D2, #2196F3)',
                        }
                    }}
                >
                    {isRunningSimulation ? 'Running...' : 'Run Simulation'}
                </Button>
            </Box>
        </Card>
    );
}

export default SimulationControls;