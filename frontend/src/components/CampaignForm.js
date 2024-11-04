import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useSelector } from 'react-redux';

const CampaignForm = ({ campaign, onSubmit, onCancel }) => {
  const { emailList } = useSelector((state) => state.emails);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    scheduledDate: null,
    emailIds: [],
  });

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        subject: campaign.subject,
        content: campaign.content,
        scheduledDate: campaign.scheduledDate,
        emailIds: campaign.emailIds || [],
      });
    }
  }, [campaign]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Failed to save campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {campaign ? 'Edit Campaign' : 'Create New Campaign'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Campaign Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Email Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Email Content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Select Email Accounts</InputLabel>
          <Select
            multiple
            value={formData.emailIds}
            onChange={handleChange}
            name="emailIds"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip 
                    key={value} 
                    label={emailList.find(email => email.id === value)?.email} 
                  />
                ))}
              </Box>
            )}
          >
            {emailList.map((email) => (
              <MenuItem key={email.id} value={email.id}>
                {email.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DateTimePicker
          label="Schedule Date (Optional)"
          value={formData.scheduledDate}
          onChange={(newValue) => {
            setFormData({ ...formData, scheduledDate: newValue });
          }}
          renderInput={(params) => (
            <TextField {...params} fullWidth margin="normal" />
          )}
        />

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Campaign'}
          </Button>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CampaignForm; 