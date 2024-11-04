import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Container
} from '@mui/material';
import { Email, Campaign, Schedule } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const features = [
    {
      title: 'Email Accounts',
      description: 'Manage your email accounts and providers',
      icon: <Email fontSize="large" color="primary" />,
      action: () => navigate('/email-accounts')
    },
    {
      title: 'Campaigns',
      description: 'Create and manage email campaigns',
      icon: <Campaign fontSize="large" color="primary" />,
      action: () => navigate('/campaigns')
    },
    {
      title: 'Schedule',
      description: 'Schedule and automate your campaigns',
      icon: <Schedule fontSize="large" color="primary" />,
      action: () => navigate('/schedule')
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your email campaigns and scheduling from one place
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography gutterBottom variant="h5" component="h2">
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="large" 
                  fullWidth 
                  onClick={feature.action}
                >
                  Manage
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home; 