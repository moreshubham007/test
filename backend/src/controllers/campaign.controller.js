const { Campaign, EmailAccount } = require('../models');
const emailService = require('../services/emailService');
const dripService = require('../services/dripService');
const logger = require('../config/logger');

const campaignController = {
  getAllCampaigns: async (req, res) => {
    try {
      const campaigns = await Campaign.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']]
      });
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
  },

  createCampaign: async (req, res) => {
    try {
      const { name, subject, content, scheduledDate, emailIds } = req.body;
      
      const campaign = await Campaign.create({
        name,
        subject,
        content,
        scheduledDate,
        userId: req.user.id,
        status: scheduledDate ? 'scheduled' : 'draft'
      });

      if (emailIds && emailIds.length > 0) {
        await campaign.setEmails(emailIds);
      }

      res.status(201).json(campaign);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create campaign' });
    }
  },

  getCampaign: async (req, res) => {
    try {
      const campaign = await Campaign.findOne({
        where: { id: req.params.id, userId: req.user.id },
        include: [{ model: EmailAccount }]
      });

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch campaign' });
    }
  },

  updateCampaign: async (req, res) => {
    try {
      const { name, subject, content, scheduledDate, emailIds } = req.body;
      const campaign = await Campaign.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      await campaign.update({
        name,
        subject,
        content,
        scheduledDate,
        status: scheduledDate ? 'scheduled' : 'draft'
      });

      if (emailIds) {
        await campaign.setEmails(emailIds);
      }

      res.json(campaign);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update campaign' });
    }
  },

  deleteCampaign: async (req, res) => {
    try {
      const campaign = await Campaign.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      await campaign.destroy();
      res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete campaign' });
    }
  },

  sendCampaign: async (req, res) => {
    try {
      const campaign = await Campaign.findOne({
        where: { id: req.params.id, userId: req.user.id },
        include: [{ model: EmailAccount }]
      });

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      if (campaign.status === 'sent') {
        return res.status(400).json({ error: 'Campaign already sent' });
      }

      if (!campaign.EmailAccounts.length) {
        return res.status(400).json({ error: 'No email accounts configured' });
      }

      const rateLimitExceeded = await checkRateLimit(campaign.EmailAccounts);
      if (rateLimitExceeded) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      }

      await processCampaignInBatches(campaign);

      res.json({ message: 'Campaign sent successfully' });
    } catch (error) {
      logger.error('Campaign send error:', error);
      res.status(500).json({ error: 'Failed to send campaign' });
    }
  },

  startCampaign: async (req, res) => {
    try {
      const { id } = req.params;
      const campaign = await Campaign.findOne({
        where: { id, userId: req.user.id },
        include: [EmailAccount]
      });

      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }

      const success = await dripService.startDripCampaign(
        campaign,
        campaign.EmailAccount
      );

      if (success) {
        res.json({ message: 'Campaign started successfully' });
      } else {
        res.status(500).json({ error: 'Failed to start campaign' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to start campaign' });
    }
  },

  pauseCampaign: async (req, res) => {
    try {
      const success = await dripService.pauseCampaign(req.params.id);
      if (success) {
        res.json({ message: 'Campaign paused successfully' });
      } else {
        res.status(404).json({ error: 'Campaign not found or already completed' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to pause campaign' });
    }
  },

  resumeCampaign: async (req, res) => {
    try {
      const success = await dripService.resumeCampaign(req.params.id);
      if (success) {
        res.json({ message: 'Campaign resumed successfully' });
      } else {
        res.status(404).json({ error: 'Campaign not found or not paused' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to resume campaign' });
    }
  }
};

module.exports = campaignController; 