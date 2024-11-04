import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
  CircularProgress
} from '@mui/material';
import { Edit, Delete, Send } from '@mui/icons-material';
import { fetchCampaigns } from '../store/slices/campaignSlice';
import { format } from 'date-fns';

const CampaignList = ({ onEdit, onDelete, onSend }) => {
  const dispatch = useDispatch();
  const { campaigns, loading } = useSelector((state) => state.campaigns);

  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

  const getStatusColor = (status) => {
    const colors = {
      draft: 'default',
      scheduled: 'primary',
      sending: 'warning',
      sent: 'success',
      failed: 'error'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Scheduled Date</TableCell>
            <TableCell>Recipients</TableCell>
            <TableCell>Success/Failed</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell>{campaign.name}</TableCell>
              <TableCell>
                <Chip 
                  label={campaign.status} 
                  color={getStatusColor(campaign.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {campaign.scheduledDate 
                  ? format(new Date(campaign.scheduledDate), 'PPp')
                  : 'Not scheduled'}
              </TableCell>
              <TableCell>{campaign.totalRecipients}</TableCell>
              <TableCell>
                {campaign.successfulSends}/{campaign.failedSends}
              </TableCell>
              <TableCell align="right">
                <IconButton 
                  onClick={() => onEdit(campaign)}
                  disabled={campaign.status === 'sent'}
                >
                  <Edit />
                </IconButton>
                <IconButton 
                  onClick={() => onDelete(campaign.id)}
                  disabled={campaign.status === 'sending'}
                >
                  <Delete />
                </IconButton>
                {campaign.status === 'draft' && (
                  <IconButton 
                    color="primary"
                    onClick={() => onSend(campaign.id)}
                  >
                    <Send />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {campaigns.length === 0 && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No campaigns found. Create your first campaign!
          </Typography>
        </Box>
      )}
    </TableContainer>
  );
};

export default CampaignList; 