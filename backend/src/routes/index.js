const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const emailRoutes = require('./email.routes');
const campaignRoutes = require('./campaign.routes');
const templateRoutes = require('./template.routes');
const recipientRoutes = require('./recipient.routes');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/emails', authenticateToken, emailRoutes);
router.use('/campaigns', authenticateToken, campaignRoutes);
router.use('/templates', authenticateToken, templateRoutes);
router.use('/recipients', authenticateToken, recipientRoutes);

module.exports = router; 