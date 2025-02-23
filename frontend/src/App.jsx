import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Paper,
    ThemeProvider,
    createTheme,
    CssBaseline,
    Fade,
    Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { runSimulations } from './utils/simulationUtils';
import ErrorBoundary from './components/ErrorBoundary';
import PortfolioControls from './components/PortfolioControls';
import SimulationControls from './components/SimulationControls';
import SimulationResults from './components/SimulationResults';

// Create dark theme
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
    typography: {
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
            marginBottom: '2rem',
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
});

function App() {
    const [error, setError] = useState(null);
    const [assets, setAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [simulationYears, setSimulationYears] = useState(20);
    const [simulationResults, setSimulationResults] = useState(null);
    const [showSimulation, setShowSimulation] = useState(false);
    const [periodicInvestment, setPeriodicInvestment] = useState(500);
    const [investmentFrequency, setInvestmentFrequency] = useState('monthly');
    const [initialInvestment, setInitialInvestment] = useState(10000);
    const [portfolio, setPortfolio] = useState([{ assetId: 'SP500', allocation: 100 }]);
    const [portfolioData, setPortfolioData] = useState({});
    const [isRunningSimulation, setIsRunningSimulation] = useState(false);

    useEffect(() => {
        const fetchAssets = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/assets');
                if (!response.ok) throw new Error('Failed to fetch assets');
                const data = await response.json();
                setAssets(data);
            } catch (err) {
                console.error('Error fetching assets:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssets();
    }, []);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const results = {};
                for (const item of portfolio) {
                    const response = await fetch(`http://localhost:5000/api/asset/${item.assetId}/history`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${item.assetId} data`);
                    }
                    results[item.assetId] = await response.json();
                }
                setPortfolioData(results);
            } catch (err) {
                console.error('Error fetching portfolio data:', err);
                setError(err.message);
            }
        };

        fetchPortfolioData();
    }, [portfolio]);

    const runSimulation = async () => {
        const totalAllocation = portfolio.reduce((sum, asset) => sum + asset.allocation, 0);
        if (totalAllocation !== 100) {
            setError('Total allocation must equal 100%');
            return;
        }
        if (!Object.keys(portfolioData).length) {
            setError('Waiting for asset data to load...');
            return;
        }

        setIsRunningSimulation(true);
        try {
            const results = await runSimulations(
                portfolioData,
                portfolio,
                simulationYears,
                initialInvestment,
                periodicInvestment,
                investmentFrequency
            );
            setSimulationResults(results);
            setShowSimulation(true);
            setError(null);
        } catch (err) {
            setError(err.message);
            setShowSimulation(false);
            setSimulationResults(null);
        } finally {
            setIsRunningSimulation(false);
        }
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <ErrorBoundary>
                <Container maxWidth="lg">
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        sx={{
                            minHeight: '100vh',
                            py: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4
                        }}
                    >
                        <Typography variant="h1" align="center" color="primary">
                            Portfolio Simulator
                        </Typography>

                        {isLoading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                                <CircularProgress size={60} />
                            </Box>
                        ) : (
                            <Fade in={!isLoading}>
                                <Box>
                                    {error && (
                                        <Alert 
                                            severity="error" 
                                            sx={{ 
                                                mb: 3, 
                                                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                                                border: '1px solid rgba(211, 47, 47, 0.3)'
                                            }}
                                        >
                                            {error}
                                        </Alert>
                                    )}

                                    <Paper 
                                        elevation={4}
                                        sx={{ 
                                            p: 3, 
                                            borderRadius: 2,
                                            backgroundColor: 'background.paper',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <Box 
                                            className="simulation-section"
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 4,
                                                '& > *': {
                                                    width: '100%',
                                                    maxWidth: '800px',
                                                    mx: 'auto'
                                                }
                                            }}
                                        >
                                            <PortfolioControls
                                                assets={assets}
                                                portfolio={portfolio}
                                                setPortfolio={setPortfolio}
                                                totalAllocation={portfolio.reduce((sum, asset) => sum + asset.allocation, 0)}
                                            />
                                            <SimulationControls
                                                initialInvestment={initialInvestment}
                                                setInitialInvestment={setInitialInvestment}
                                                simulationYears={simulationYears}
                                                setSimulationYears={setSimulationYears}
                                                periodicInvestment={periodicInvestment}
                                                setPeriodicInvestment={setPeriodicInvestment}
                                                investmentFrequency={investmentFrequency}
                                                setInvestmentFrequency={setInvestmentFrequency}
                                                runSimulation={runSimulation}
                                                isRunningSimulation={isRunningSimulation}
                                            />
                                        </Box>
                                    </Paper>

                                    {simulationResults && showSimulation && (
                                        <Fade in timeout={1000}>
                                            <Paper 
                                                elevation={4}
                                                sx={{ 
                                                    mt: 4, 
                                                    p: 3, 
                                                    borderRadius: 2,
                                                    backgroundColor: 'background.paper'
                                                }}
                                            >
                                                <Typography variant="h5" gutterBottom color="primary">
                                                    Simulation Results
                                                </Typography>
                                                <Divider sx={{ my: 2 }} />
                                                <SimulationResults 
                                                    simulationResults={simulationResults}
                                                    initialInvestment={initialInvestment}
                                                    periodicInvestment={periodicInvestment}
                                                    investmentFrequency={investmentFrequency}
                                                    simulationYears={simulationYears}
                                                />
                                            </Paper>
                                        </Fade>
                                    )}
                                </Box>
                            </Fade>
                        )}
                    </Box>
                </Container>
            </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
