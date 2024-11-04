import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  Snackbar,
  Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';
import CampaignList from '../components/CampaignList';
import CampaignForm from '../components/CampaignForm';
import { createCampaign, updateCampaign, deleteCampaign, sendCampaign } from '../store/slices/campaignSlice';

const Campaign = () => {
  const dispatch = useDispatch();
  const [openForm, setOpenForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCreateCampaign = async (campaignData) => {
    try {
      await dispatch(createCampaign(campaignData)).unwrap();
      setOpenForm(false);
      showSnackbar('Campaign created successfully', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Failed to create campaign', 'error');
    }
  };

  const handleUpdateCampaign = async (campaignData) => {
    try {
      await dispatch(updateCampaign({ 
        id: selectedCampaign.id, 
        ...campaignData 
      })).unwrap();
      setOpenForm(false);
      setSelectedCampaign(null);
      showSnackbar('Campaign updated successfully', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Failed to update campaign', 'error');
    }
  };

  const handleDeleteCampaign = async (id) => {
    try {
      await dispatch(deleteCampaign(id)).unwrap();
      showSnackbar('Campaign deleted successfully', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Failed to delete campaign', 'error');
    }
  };

  const handleSendCampaign = async (id) => {
    try {
      await dispatch(sendCampaign(id)).unwrap();
      showSnackbar('Campaign sent successfully', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Failed to send campaign', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedCampaign(null);
  };

  const handleEdit = (campaign) => {
    setSelectedCampaign(campaign);
    setOpenForm(true);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Campaigns
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenForm(true)}
        >
          Create Campaign
        </Button>
      </Box>

      <CampaignList
        onEdit={handleEdit}
        onDelete={handleDeleteCampaign}
        onSend={handleSendCampaign}
      />

      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <CampaignForm
            campaign={selectedCampaign}
            onSubmit={selectedCampaign ? handleUpdateCampaign : handleCreateCampaign}
            onCancel={handleCloseForm}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Campaign; 