import { useState, useEffect, useRef } from "react";
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Paper,
    ThemeProvider,
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
import theme from './theme';
import Logo from './components/Logo';
import { useAssets } from './hooks/useAssets';
import { usePortfolioData } from './hooks/usePortfolioData';

function App() {
    const resultsRef = useRef(null);
    const [portfolio, setPortfolio] = useState([{ assetId: 'SP500', allocation: 100 }]);
    const { assets, isLoading: assetsLoading } = useAssets();
    const { portfolioData, error: portfolioError } = usePortfolioData(portfolio);
    const [error, setError] = useState(null);
    const [simulationYears, setSimulationYears] = useState(20);
    const [simulationResults, setSimulationResults] = useState(null);
    const [showSimulation, setShowSimulation] = useState(false);
    const [periodicInvestment, setPeriodicInvestment] = useState(500);
    const [investmentFrequency, setInvestmentFrequency] = useState('monthly');
    const [initialInvestment, setInitialInvestment] = useState(10000);
    const [isRunningSimulation, setIsRunningSimulation] = useState(false);

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
            
            // Scroll to results after they're available
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) {
            setError(err.message);
            setShowSimulation(false);
            setSimulationResults(null);
        } finally {
            setIsRunningSimulation(false);
        }
    };

    useEffect(() => {
        if (portfolioError) {
            setError(portfolioError);
        }
    }, [portfolioError]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ErrorBoundary>
                <Container maxWidth="lg" sx={{ py: 4 }}>
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
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Logo />
                        </motion.div>
                        
                        {assetsLoading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                                <CircularProgress size={60} />
                            </Box>
                        ) : (
                            <Fade in={!assetsLoading}>
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
                                                ref={resultsRef}
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
