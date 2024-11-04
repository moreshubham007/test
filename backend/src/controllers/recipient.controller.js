const { Recipient, Campaign } = require('../models');
const { Op } = require('sequelize');

const recipientController = {
  getAllRecipients: async (req, res) => {
    try {
      const { search, status, tags } = req.query;
      const where = { userId: req.user.id };

      if (search) {
        where[Op.or] = [
          { email: { [Op.iLike]: `%${search}%` } },
          { name: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (status) {
        where.status = status;
      }

      if (tags) {
        where.tags = { [Op.overlap]: tags.split(',') };
      }

      const recipients = await Recipient.findAll({ where });
      res.json(recipients);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch recipients' });
    }
  },

  createRecipient: async (req, res) => {
    try {
      const { email, name, metadata, tags } = req.body;
      
      const existingRecipient = await Recipient.findOne({
        where: { email, userId: req.user.id }
      });

      if (existingRecipient) {
        return res.status(400).json({ error: 'Recipient already exists' });
      }

      const recipient = await Recipient.create({
        email,
        name,
        metadata,
        tags,
        userId: req.user.id
      });

      res.status(201).json(recipient);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create recipient' });
    }
  },

  bulkCreateRecipients: async (req, res) => {
    try {
      const { recipients } = req.body;
      const createdRecipients = await Promise.all(
        recipients.map(async (recipient) => {
          const [newRecipient] = await Recipient.findOrCreate({
            where: { email: recipient.email, userId: req.user.id },
            defaults: {
              ...recipient,
              userId: req.user.id
            }
          });
          return newRecipient;
        })
      );

      res.status(201).json(createdRecipients);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create recipients' });
    }
  },

  updateRecipient: async (req, res) => {
    try {
      const recipient = await Recipient.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!recipient) {
        return res.status(404).json({ error: 'Recipient not found' });
      }

      const { email, name, metadata, tags, status } = req.body;
      await recipient.update({
        email,
        name,
        metadata,
        tags,
        status
      });

      res.json(recipient);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update recipient' });
    }
  },

  deleteRecipient: async (req, res) => {
    try {
      const recipient = await Recipient.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!recipient) {
        return res.status(404).json({ error: 'Recipient not found' });
      }

      await recipient.destroy();
      res.json({ message: 'Recipient deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete recipient' });
    }
  }
};

module.exports = recipientController; 