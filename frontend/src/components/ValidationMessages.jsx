import { Alert, Box } from '@mui/material';

const ValidationMessages = ({ validation }) => {
    if (!validation) return null;

    const { errors, warnings } = validation;

    return (
        <Box sx={{ mb: 2 }}>
            {errors.map((error, index) => (
                <Alert 
                    key={`error-${index}`} 
                    severity="error" 
                    sx={{ 
                        mb: 1,
                        backgroundColor: 'rgba(211, 47, 47, 0.1)',
                        border: '1px solid rgba(211, 47, 47, 0.3)'
                    }}
                >
                    {error}
                </Alert>
            ))}
            {warnings.map((warning, index) => (
                <Alert 
                    key={`warning-${index}`} 
                    severity="warning"
                    sx={{ 
                        mb: 1,
                        backgroundColor: 'rgba(237, 108, 2, 0.1)',
                        border: '1px solid rgba(237, 108, 2, 0.3)'
                    }}
                >
                    {warning}
                </Alert>
            ))}
        </Box>
    );
};

export default ValidationMessages; 