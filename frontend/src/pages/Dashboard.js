import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Email,
  Campaign,
  Schedule,
  Add,
  Search,
  Settings,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchCampaigns } from '../store/slices/campaignSlice';
import { fetchEmailList } from '../store/slices/emailSlice';

const DashboardCard = ({ title, value, icon, color, onClick }) => (
  <Card 
    sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${color[0]} 0%, ${color[1]} 100%)`,
      color: 'white',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: onClick ? 'translateY(-5px)' : 'none',
      }
    }}
    onClick={onClick}
  >
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ color: 'white', opacity: 0.8 }} gutterBottom>
          {title}
        </Typography>
        <Box sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          padding: 1
        }}>
          {icon}
        </Box>
      </Box>
      <Typography variant="h4" component="div" sx={{ color: 'white' }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { campaigns, loading: campaignsLoading } = useSelector((state) => state.campaigns);
  const { emailList, loading: emailsLoading } = useSelector((state) => state.emails);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchCampaigns());
    dispatch(fetchEmailList());
  }, [dispatch]);

  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'sending' || c.status === 'scheduled').length,
    completedCampaigns: campaigns.filter(c => c.status === 'sent').length,
    emailAccounts: emailList.length,
  };

  const recentCampaigns = campaigns
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
          py: 4,
          px: 3,
          mb: 4
        }}
      >
        <Box sx={{ 
          maxWidth: 'lg',
          mx: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
            Welcome back, {user?.name}!
          </Typography>
          <IconButton sx={{ color: 'white' }}>
            <Settings />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: 'lg', mx: 'auto', px: 3 }}>
        {/* Search and Actions */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          gap: 2
        }}>
          <Box sx={{ position: 'relative', width: { xs: '100%', sm: 'auto' } }}>
            <Search sx={{ 
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'text.secondary'
            }} />
            <TextField
              placeholder="Search campaigns..."
              variant="outlined"
              size="small"
              sx={{ 
                width: { xs: '100%', sm: '300px' },
                '& .MuiOutlinedInput-root': {
                  paddingLeft: '40px'
                }
              }}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/campaigns/new')}
            sx={{
              background: 'linear-gradient(135deg, #4caf50 0%, #2196f3 100%)',
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            New Campaign
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Total Campaigns"
              value={stats.totalCampaigns}
              icon={<Campaign sx={{ color: 'white' }} />}
              color={['#1976d2', '#64b5f6']}
              onClick={() => navigate('/campaigns')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Active Campaigns"
              value={stats.activeCampaigns}
              icon={<Schedule sx={{ color: 'white' }} />}
              color={['#9c27b0', '#ba68c8']}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Completed"
              value={stats.completedCampaigns}
              icon={<CheckCircle sx={{ color: 'white' }} />}
              color={['#4caf50', '#81c784']}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Email Accounts"
              value={stats.emailAccounts}
              icon={<Email sx={{ color: 'white' }} />}
              color={['#ff9800', '#ffb74d']}
              onClick={() => navigate('/email-accounts')}
            />
          </Grid>
        </Grid>

        {/* Recent Campaigns */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="h6">Recent Campaigns</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/campaigns')}
                >
                  View All
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {recentCampaigns.map((campaign) => (
                <Box
                  key={campaign.id}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Box>
                      <Typography variant="subtitle1">{campaign.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Status: {campaign.status}
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small"
                      onClick={() => navigate(`/campaigns/${campaign.id}`)}
                    >
                      <ArrowForward />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Email Accounts */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="h6">Email Accounts</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/email-accounts')}
                >
                  Manage
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {emailList.map((email) => (
                <Box
                  key={email.id}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Typography variant="subtitle1">{email.email}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Provider: {email.provider} | Status: {email.status}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard; 