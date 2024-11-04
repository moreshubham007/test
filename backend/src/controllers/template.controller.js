const { Template } = require('../models');

const templateController = {
  getAllTemplates: async (req, res) => {
    try {
      const templates = await Template.findAll({
        where: {
          $or: [
            { userId: req.user.id },
            { isPublic: true }
          ]
        }
      });
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch templates' });
    }
  },

  createTemplate: async (req, res) => {
    try {
      const { name, subject, content, variables, category, isPublic } = req.body;
      const template = await Template.create({
        name,
        subject,
        content,
        variables,
        category,
        isPublic,
        userId: req.user.id
      });
      res.status(201).json(template);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create template' });
    }
  },

  getTemplate: async (req, res) => {
    try {
      const template = await Template.findOne({
        where: {
          id: req.params.id,
          $or: [
            { userId: req.user.id },
            { isPublic: true }
          ]
        }
      });

      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }

      res.json(template);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch template' });
    }
  },

  updateTemplate: async (req, res) => {
    try {
      const template = await Template.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }

      const { name, subject, content, variables, category, isPublic } = req.body;
      await template.update({
        name,
        subject,
        content,
        variables,
        category,
        isPublic
      });

      res.json(template);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update template' });
    }
  },

  deleteTemplate: async (req, res) => {
    try {
      const template = await Template.findOne({
        where: { id: req.params.id, userId: req.user.id }
      });

      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }

      await template.destroy();
      res.json({ message: 'Template deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete template' });
    }
  }
};

module.exports = templateController; 