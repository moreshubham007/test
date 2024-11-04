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
import TemplateList from '../components/TemplateList';
import TemplateForm from '../components/TemplateForm';
import { createTemplate, updateTemplate, deleteTemplate } from '../store/slices/templateSlice';

const Template = () => {
  const dispatch = useDispatch();
  const [openForm, setOpenForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCreateTemplate = async (templateData) => {
    try {
      await dispatch(createTemplate(templateData)).unwrap();
      setOpenForm(false);
      showSnackbar('Template created successfully', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Failed to create template', 'error');
    }
  };

  const handleUpdateTemplate = async (templateData) => {
    try {
      await dispatch(updateTemplate({
        id: selectedTemplate.id,
        ...templateData
      })).unwrap();
      setOpenForm(false);
      setSelectedTemplate(null);
      showSnackbar('Template updated successfully', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Failed to update template', 'error');
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      await dispatch(deleteTemplate(id)).unwrap();
      showSnackbar('Template deleted successfully', 'success');
    } catch (error) {
      showSnackbar(error.message || 'Failed to delete template', 'error');
    }
  };

  const handleCopyTemplate = (template) => {
    const copiedTemplate = {
      ...template,
      name: `${template.name} (Copy)`,
    };
    delete copiedTemplate.id;
    setSelectedTemplate(copiedTemplate);
    setOpenForm(true);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedTemplate(null);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Email Templates
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenForm(true)}
        >
          Create Template
        </Button>
      </Box>

      <TemplateList
        onEdit={setSelectedTemplate}
        onDelete={handleDeleteTemplate}
        onCopy={handleCopyTemplate}
      />

      <Dialog
        open={openForm}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <TemplateForm
            template={selectedTemplate}
            onSubmit={selectedTemplate ? handleUpdateTemplate : handleCreateTemplate}
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

export default Template; 