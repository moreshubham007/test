import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchEmailList, addEmailAddresses, deleteEmailAccount } from '../store/slices/emailSlice';

const EmailAccountManager = () => {
  const dispatch = useAppDispatch();
  const { emailList, loading, error } = useAppSelector((state) => state.emails);
  const [open, setOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    dispatch(fetchEmailList());
  }, [dispatch]);

  const handleAddEmail = async () => {
    if (!newEmail || !isValidEmail(newEmail)) {
      setSnackbarMessage('Please enter a valid email address');
      setSnackbarOpen(true);
      return;
    }

    try {
      await dispatch(addEmailAddresses({ email: newEmail })).unwrap();
      setNewEmail('');
      setOpen(false);
      setSnackbarMessage('Email added successfully');
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err.message || 'Failed to add email');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (emailId) => {
    try {
      setLoading(true);
      await dispatch(deleteEmailAccount(emailId)).unwrap();
      setSnackbarMessage('Email deleted successfully');
    } catch (error) {
      setSnackbarMessage(error.message || 'Failed to delete email');
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Email Accounts
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Add Email
          </Button>
        </Box>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <List>
            {emailList.map((email) => (
              <ListItem
                key={email.id}
                divider
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ListItemText
                  primary={email.address}
                  secondary={`Status: ${email.status || 'Active'}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(email.id)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Add Email Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Email Account</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddEmail} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default EmailAccountManager; 