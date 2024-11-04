const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const campaignController = require('../controllers/campaign.controller');
const validateRequest = require('../middleware/validateRequest');

router.get('/', campaignController.getAllCampaigns);

router.post('/',
  [
    body('name').notEmpty().withMessage('Campaign name is required'),
    body('subject').notEmpty().withMessage('Email subject is required'),
    body('content').notEmpty().withMessage('Email content is required'),
    body('scheduledDate').optional().isISO8601().withMessage('Invalid date format'),
    validateRequest
  ],
  campaignController.createCampaign
);

router.get('/:id', campaignController.getCampaign);
router.put('/:id', campaignController.updateCampaign);
router.delete('/:id', campaignController.deleteCampaign);
router.post('/:id/send', campaignController.sendCampaign);

module.exports = router; 