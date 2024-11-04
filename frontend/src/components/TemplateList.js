import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import { Edit, Delete, ContentCopy } from '@mui/icons-material';
import { fetchTemplates } from '../store/slices/templateSlice';

const TemplateList = ({ onEdit, onDelete, onCopy }) => {
  const dispatch = useDispatch();
  const { templates, loading } = useSelector((state) => state.templates);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

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
            <TableCell>Category</TableCell>
            <TableCell>Variables</TableCell>
            <TableCell>Public</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell>{template.name}</TableCell>
              <TableCell>{template.category || '-'}</TableCell>
              <TableCell>
                {template.variables?.map((variable, index) => (
                  <Chip
                    key={index}
                    label={variable}
                    size="small"
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </TableCell>
              <TableCell>
                <Chip
                  label={template.isPublic ? 'Public' : 'Private'}
                  color={template.isPublic ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(template)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => onCopy(template)}>
                  <ContentCopy />
                </IconButton>
                <IconButton onClick={() => onDelete(template.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TemplateList; 