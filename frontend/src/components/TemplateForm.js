import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';

const TemplateForm = ({ template, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    category: '',
    variables: [],
    isPublic: false,
  });
  const [newVariable, setNewVariable] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        subject: template.subject,
        content: template.content,
        category: template.category || '',
        variables: template.variables || [],
        isPublic: template.isPublic,
      });
    }
  }, [template]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isPublic' ? checked : value,
    }));
  };

  const handleAddVariable = () => {
    if (newVariable && !formData.variables.includes(newVariable)) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, newVariable],
      }));
      setNewVariable('');
    }
  };

  const handleRemoveVariable = (variableToRemove) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v !== variableToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Template Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Content"
        name="content"
        value={formData.content}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={6}
        required
      />

      <TextField
        fullWidth
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        margin="normal"
      />

      <Box sx={{ mt: 2, mb: 1 }}>
        <TextField
          label="Add Variable"
          value={newVariable}
          onChange={(e) => setNewVariable(e.target.value)}
          size="small"
        />
        <Button
          onClick={handleAddVariable}
          variant="outlined"
          size="small"
          sx={{ ml: 1 }}
        >
          Add
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        {formData.variables.map((variable, index) => (
          <Chip
            key={index}
            label={variable}
            onDelete={() => handleRemoveVariable(variable)}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Box>

      <FormControlLabel
        control={
          <Switch
            checked={formData.isPublic}
            onChange={handleChange}
            name="isPublic"
          />
        }
        label="Make template public"
      />

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Template'}
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
  );
};

export default TemplateForm; 