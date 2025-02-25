import { Box, Typography } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

function Logo({ variant = 'default' }) {
    return (
        <Box 
            sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                justifyContent: 'center',
                mb: 4
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0.3) 100%)',
                    boxShadow: '0 8px 32px rgba(33, 150, 243, 0.15)',
                    border: '1px solid rgba(33, 150, 243, 0.2)',
                }}
            >
                <ShowChartIcon 
                    sx={{ 
                        fontSize: '2.5rem',
                        color: '#2196F3',
                        filter: 'drop-shadow(0 2px 4px rgba(33, 150, 243, 0.3))'
                    }} 
                />
                <TimelineIcon 
                    sx={{ 
                        fontSize: '2rem',
                        color: '#64B5F6',
                        ml: -1,
                        filter: 'drop-shadow(0 2px 4px rgba(100, 181, 246, 0.3))'
                    }} 
                />
                <AccountBalanceIcon 
                    sx={{ 
                        fontSize: '1.8rem',
                        color: '#90CAF9',
                        ml: -1,
                        filter: 'drop-shadow(0 2px 4px rgba(144, 202, 249, 0.3))'
                    }} 
                />
            </Box>
            <Box>
                <Typography
                    variant="h4"
                    sx={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 800,
                        background: 'linear-gradient(45deg, #2196F3 30%, #90CAF9 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 2px 4px rgba(33, 150, 243, 0.2)',
                        letterSpacing: '-0.5px',
                        mb: -0.5
                    }}
                >
                    Portfolio Simulator
                </Typography>
                <Typography
                    variant="subtitle2"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        fontSize: '0.7rem'
                    }}
                >
                    Investment Analysis Tool
                </Typography>
            </Box>
        </Box>
    );
}

export default Logo;
