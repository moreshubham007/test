import { Box, AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Logo } from '../assets/logo';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              mr: 3
            }}
            onClick={() => navigate('/')}
          >
            <Logo />
            <Typography 
              variant="h6" 
              component="div"
              sx={{ 
                ml: 1,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              DripsendPro
            </Typography>
          </Box>

          {isAuthenticated && (
            <Stack 
              direction="row" 
              spacing={2} 
              sx={{ 
                flexGrow: 1,
                '& .MuiButton-root': {
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }
              }}
            >
              <Button onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button onClick={() => navigate('/email-accounts')}>
                Email Accounts
              </Button>
              <Button onClick={() => navigate('/campaigns')}>
                Campaigns
              </Button>
              <Button onClick={() => navigate('/templates')}>
                Templates
              </Button>
            </Stack>
          )}

          {isAuthenticated ? (
            <Button 
              color="inherit"
              onClick={handleLogout}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              Logout
            </Button>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button 
                color="inherit"
                onClick={() => navigate('/login')}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }
                }}
              >
                Login
              </Button>
              <Button 
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  backgroundColor: 'white',
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              >
                Register
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>{children}</Box>
    </Box>
  );
};

export default Layout;