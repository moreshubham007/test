const jwt = require('jsonwebtoken');
const passport = require('passport');
const { User, EmailAccount } = require('../models');

const authController = {
  register: async (req, res) => {
    try {
      const { email, password, name } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Create new user
      const user = await User.create({
        email,
        password,
        name,
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      res.status(201).json({
        user: userResponse,
        token,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if user is active
      if (user.status !== 'active') {
        return res.status(403).json({ error: 'Account is not active' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      res.json({
        user: userResponse,
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  },

  googleAuth: passport.authenticate('google', {
    scope: [
      'profile', 
      'email',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/gmail.modify'
    ],
    accessType: 'offline',
    prompt: 'consent'
  }),

  googleCallback: (req, res, next) => {
    passport.authenticate('google', { session: false }, async (err, user) => {
      try {
        if (err) {
          return res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
        }

        if (!user) {
          return res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
        }

        // Get the email account that was just created/updated
        const emailAccount = await EmailAccount.findOne({
          where: { 
            userId: user.id,
            provider: 'gmail'
          },
          order: [['updatedAt', 'DESC']]
        });

        // Generate JWT token
        const token = jwt.sign(
          { 
            id: user.id, 
            email: user.email,
            emailAccountId: emailAccount?.id // Include email account ID
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Redirect to frontend with token
        res.redirect(
          `${process.env.FRONTEND_URL}/auth/success?token=${token}`
        );
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  },

  outlookAuth: passport.authenticate('outlook', {
    scope: ['openid', 'profile', 'email', 'Mail.Send']
  }),

  outlookCallback: (req, res, next) => {
    passport.authenticate('outlook', { session: false }, (err, user) => {
      if (err) {
        return res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
      }
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    })(req, res, next);
  },

  getCurrentUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  },
};

module.exports = authController; 