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
    Tooltip,
    InputAdornment,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

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
    isRunningSimulation,
    hasErrors
}) {
    const handleNumberInput = (value, setter, isInteger = false) => {
        // Handle special cases
        if (value === '' || value === '-' || (!isInteger && (value === '.' || value === '-.'))) {
            setter(value);
            return;
        }

        // For integer fields, don't allow decimal points
        if (isInteger && value.includes('.')) {
            return;
        }

        // Validate number format
        const regex = isInteger ? /^-?\d*$/ : /^-?\d*\.?\d*$/;
        if (!regex.test(value)) {
            return;
        }

        const numValue = Number(value);
        if (!isNaN(numValue)) {
            // For currency values, limit to 2 decimal places
            if (!isInteger && value.includes('.')) {
                const [whole, decimal] = value.split('.');
                if (decimal && decimal.length > 2) {
                    return;
                }
            }
            setter(value);
        }
    };

    const formatCurrency = (value) => {
        if (value === '' || value === '-' || value === '.' || value === '-.') {
            return value;
        }
        const num = Number(value);
        if (!isNaN(num)) {
            return num.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            });
        }
        return value;
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
                    <Tooltip title="Initial amount to invest in the portfolio" arrow placement="top">
                        <TextField
                            label="Initial Investment ($)"
                            type="text"
                            value={initialInvestment}
                            onChange={(e) => handleNumberInput(e.target.value, setInitialInvestment)}
                            placeholder="Enter amount..."
                            fullWidth
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <InfoIcon color="action" fontSize="small" />
                                    </InputAdornment>
                                )
                            }}
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
                    </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Tooltip title="Number of years to simulate the portfolio performance" arrow placement="top">
                        <TextField
                            label="Investment Period (Years)"
                            type="text"
                            value={simulationYears}
                            onChange={(e) => handleNumberInput(e.target.value, setSimulationYears, true)}
                            placeholder="Enter years..."
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <InfoIcon color="action" fontSize="small" />
                                    </InputAdornment>
                                )
                            }}
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
                    </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Tooltip title="Regular investment or withdrawal amount (use negative for withdrawals)" arrow placement="top">
                        <TextField
                            label="Periodic Investment/Withdrawal ($)"
                            type="text"
                            value={periodicInvestment}
                            onChange={(e) => handleNumberInput(e.target.value, setPeriodicInvestment)}
                            placeholder="Enter amount (negative for withdrawal)..."
                            fullWidth
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <InfoIcon color="action" fontSize="small" />
                                    </InputAdornment>
                                )
                            }}
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
                    </Tooltip>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Tooltip title="Frequency of periodic investments or withdrawals" arrow placement="top">
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
                    </Tooltip>
                </Grid>
            </Grid>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button 
                    onClick={runSimulation} 
                    disabled={isRunningSimulation || hasErrors}
                    variant="contained"
                    size="large"
                    sx={{
                        px: 4,
                        py: 1.5,
                        background: 'linear-gradient(45deg, #2196F3, #64B5F6)',
                        boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #1976D2, #2196F3)',
                        },
                        '&:disabled': {
                            background: 'linear-gradient(45deg, #9e9e9e, #bdbdbd)',
                            opacity: 0.7
                        }
                    }}
                >
                    {isRunningSimulation ? 'Running...' : hasErrors ? 'Fix Errors to Run' : 'Run Simulation'}
                </Button>
            </Box>
        </Card>
    );
}

export default SimulationControls;