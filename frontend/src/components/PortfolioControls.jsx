import { useState } from 'react';
import { 
    Grid, 
    Button, 
    Select, 
    MenuItem, 
    TextField, 
    IconButton, 
    Tooltip, 
    LinearProgress, 
    Card, 
    Typography,
    Box,
    Alert,
    Fade
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

function PortfolioControls({ assets, portfolio, setPortfolio, totalAllocation }) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleAllocationChange = (index, newAllocation) => {
        const value = Math.max(0, Math.min(100, Number(newAllocation)));
        const updatedPortfolio = [...portfolio];
        updatedPortfolio[index].allocation = value;
        setPortfolio(updatedPortfolio);
    };

    const addAsset = () => {
        if (portfolio.length >= 5) return;
        setPortfolio([...portfolio, { assetId: assets[0]?.id || 'SP500', allocation: 0 }]);
    };

    const removeAsset = (index) => {
        setPortfolio(portfolio.filter((_, i) => i !== index));
    };

    return (
        <Card sx={{ p: 3, borderRadius: 2, boxShadow: 4, bgcolor: '#1e1e1e', color: '#ffffff' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Portfolio Allocation
            </Typography>
            
            <AnimatePresence>
                {portfolio.map((asset, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Grid
                            container
                            spacing={2}
                            alignItems="center"
                            sx={{ mb: 2, bgcolor: '#252525', p: 2, borderRadius: 2 }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <Grid item xs={12} sm={5}>
                                <Select
                                    fullWidth
                                    value={asset.assetId}
                                    onChange={(e) => {
                                        const updated = [...portfolio];
                                        updated[index].assetId = e.target.value;
                                        setPortfolio(updated);
                                    }}
                                    size="small"
                                    sx={{ bgcolor: '#333', color: '#fff' }}
                                >
                                    {assets.map(a => (
                                        <MenuItem key={a.id} value={a.id} sx={{ color: '#fff' }}>
                                            {a.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    type="number"
                                    value={asset.allocation}
                                    onChange={(e) => handleAllocationChange(index, e.target.value)}
                                    InputProps={{
                                        endAdornment: '%',
                                        inputProps: { min: 0, max: 100, step: 5 },
                                        sx: { color: '#fff' }
                                    }}
                                    size="small"
                                    fullWidth
                                    sx={{ bgcolor: '#333', color: '#fff' }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                {portfolio.length > 1 && (
                                    <Tooltip title="Remove Asset">
                                        <IconButton 
                                            onClick={() => removeAsset(index)}
                                            color="error"
                                            size="small"
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <Fade in={hoveredIndex === index}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', color: '#bbb' }}>
                                        {assets.find(a => a.id === asset.assetId)?.firstAvailableDate && 
                                            `Data available from: ${new Date(assets.find(a => a.id === asset.assetId).firstAvailableDate).getFullYear()}`
                                        }
                                    </Typography>
                                </Fade>
                            </Grid>
                        </Grid>
                    </motion.div>
                ))}
            </AnimatePresence>

            {portfolio.length < 5 && (
                <Button
                    startIcon={<AddIcon />}
                    onClick={addAsset}
                    variant="contained"
                    sx={{ mt: 2, bgcolor: '#333', color: '#fff', ':hover': { bgcolor: '#444' } }}
                >
                    Add Asset
                </Button>
            )}

            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Total Allocation: {totalAllocation}%
                </Typography>
                <LinearProgress 
                    variant="determinate" 
                    value={Math.min(totalAllocation, 100)}
                    color={totalAllocation === 100 ? "success" : "warning"}
                    sx={{ height: 8, borderRadius: 4, bgcolor: '#333' }}
                />
                {totalAllocation !== 100 && (
                    <Alert severity="warning" sx={{ mt: 2, bgcolor: '#2e2e2e', color: '#ffcc00' }}>
                        Total allocation must equal 100%
                    </Alert>
                )}
            </Box>
        </Card>
    );
}

export default PortfolioControls;
