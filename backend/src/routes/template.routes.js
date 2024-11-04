const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const templateController = require('../controllers/template.controller');
const validateRequest = require('../middleware/validateRequest');

// Validation middleware
const templateValidation = [
  body('name').notEmpty().withMessage('Template name is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('variables').isArray().optional(),
  body('category').isString().optional(),
  body('isPublic').isBoolean().optional(),
  validateRequest
];

// Routes
router.get('/', templateController.getAllTemplates);
router.post('/', templateValidation, templateController.createTemplate);
router.get('/:id', templateController.getTemplate);
router.put('/:id', templateValidation, templateController.updateTemplate);
router.delete('/:id', templateController.deleteTemplate);

module.exports = router; 