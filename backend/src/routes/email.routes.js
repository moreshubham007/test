const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const emailController = require('../controllers/email.controller');
const validateRequest = require('../middleware/validateRequest');

router.get('/', emailController.getAllEmails);

router.post('/',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email address')
      .normalizeEmail(),
    body('provider')
      .isIn(['gmail', 'outlook', 'smtp'])
      .withMessage('Invalid provider'),
    body('smtpConfig')
      .if(body('provider').equals('smtp'))
      .isObject()
      .withMessage('SMTP configuration required for SMTP provider'),
    validateRequest
  ],
  emailController.addEmail
);

router.delete('/:id', emailController.deleteEmail);

router.post('/verify/:id', emailController.verifyEmail);

module.exports = router; 