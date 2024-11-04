const { EmailAccount } = require('../models');
const emailService = require('../services/emailService');

const emailController = {
  getAllEmails: async (req, res) => {
    try {
      const emails = await EmailAccount.findAll({
        where: { userId: req.user.id }
      });
      res.json(emails);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch emails' });
    }
  },

  addEmail: async (req, res) => {
    try {
      const { email, provider } = req.body;
      const existingEmail = await EmailAccount.findOne({
        where: { email, userId: req.user.id }
      });

      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const newEmail = await EmailAccount.create({
        email,
        provider,
        userId: req.user.id,
        status: 'pending'
      });

      // Send verification email
      await emailService.sendEmail(
        process.env.SMTP_USER,
        email,
        'Verify your email',
        'Please verify your email address',
        `<p>Click <a href="${process.env.FRONTEND_URL}/verify-email/${newEmail.id}">here</a> to verify your email.</p>`
      );

      res.status(201).json(newEmail);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add email' });
    }
  },

  deleteEmail: async (req, res) => {
    try {
      const { id } = req.params;
      const email = await EmailAccount.findOne({
        where: { id, userId: req.user.id }
      });

      if (!email) {
        return res.status(404).json({ error: 'Email not found' });
      }

      await email.destroy();
      res.json({ message: 'Email deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete email' });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { id } = req.params;
      const email = await EmailAccount.findOne({
        where: { id, userId: req.user.id }
      });

      if (!email) {
        return res.status(404).json({ error: 'Email not found' });
      }

      await email.update({ status: 'verified' });
      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to verify email' });
    }
  }
};

module.exports = emailController; 