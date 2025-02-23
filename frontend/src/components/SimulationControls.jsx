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
        <Card sx={{ p: 3, borderRadius: 2, boxShadow: 4, bgcolor: '#1e1e1e', color: '#ffffff' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#ffffff' }}>
                Simulation Controls
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Initial Investment ($)"
                        type="number"
                        value={initialInvestment}
                        onChange={(e) => setInitialInvestment(Number(e.target.value))}
                        fullWidth
                        inputProps={{ min: 0, step: 1000 }}
                        sx={{ bgcolor: '#333', input: { color: '#ffffff' }, label: { color: '#ffffff' } }}
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
                        sx={{ bgcolor: '#333', input: { color: '#ffffff' }, label: { color: '#ffffff' } }}
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
                        sx={{ bgcolor: '#333', input: { color: '#ffffff' }, label: { color: '#ffffff' } }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select
                        fullWidth
                        value={investmentFrequency}
                        onChange={(e) => setInvestmentFrequency(e.target.value)}
                        sx={{ bgcolor: '#333', color: '#ffffff' }}
                    >
                        <MenuItem value="monthly">Monthly</MenuItem>
                        <MenuItem value="yearly">Yearly</MenuItem>
                    </Select>
                </Grid>
            </Grid>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button 
                    onClick={runSimulation} 
                    disabled={isRunningSimulation} 
                    variant="contained"
                    sx={{ bgcolor: '#333', color: '#ffffff', ':hover': { bgcolor: '#444' } }}
                >
                    {isRunningSimulation ? 'Running...' : 'Run Simulation'}
                </Button>
            </Box>
        </Card>
    );
}

export default SimulationControls;