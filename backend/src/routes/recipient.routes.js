const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const recipientController = require('../controllers/recipient.controller');
const validateRequest = require('../middleware/validateRequest');

// Validation middleware
const recipientValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('name').optional().isString(),
  body('metadata').optional().isObject(),
  body('tags').optional().isArray(),
  validateRequest
];

const bulkRecipientsValidation = [
  body('recipients').isArray().withMessage('Recipients array is required'),
  body('recipients.*.email').isEmail().withMessage('Valid email is required for each recipient'),
  body('recipients.*.name').optional().isString(),
  body('recipients.*.metadata').optional().isObject(),
  body('recipients.*.tags').optional().isArray(),
  validateRequest
];

// Routes
router.get('/', recipientController.getAllRecipients);
router.post('/', recipientValidation, recipientController.createRecipient);
router.post('/bulk', bulkRecipientsValidation, recipientController.bulkCreateRecipients);
router.put('/:id', recipientValidation, recipientController.updateRecipient);
router.delete('/:id', recipientController.deleteRecipient);

module.exports = router; 