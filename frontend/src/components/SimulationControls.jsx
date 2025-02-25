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
                        type="number"
                        value={initialInvestment}
                        onChange={(e) => setInitialInvestment(Number(e.target.value))}
                        fullWidth
                        inputProps={{ min: 0, step: 1000 }}
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
                        type="number"
                        value={simulationYears}
                        onChange={(e) => setSimulationYears(Number(e.target.value))}
                        fullWidth
                        inputProps={{ min: 1, max: 30 }}
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
                        label="Periodic Investment ($)"
                        type="number"
                        value={periodicInvestment}
                        onChange={(e) => setPeriodicInvestment(Number(e.target.value))}
                        fullWidth
                        inputProps={{ min: 0, step: 100 }}
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