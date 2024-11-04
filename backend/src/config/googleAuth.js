const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, EmailAccount } = require('../models');

const setupGoogleAuth = () => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
    scope: [
      'profile', 
      'email',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/gmail.modify'
    ]
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({
        where: { email: profile.emails[0].value }
      });

      if (!user) {
        // Create new user if doesn't exist
        user = await User.create({
          email: profile.emails[0].value,
          name: profile.displayName,
          password: Math.random().toString(36).slice(-8), // Generate random password
          status: 'active'
        });
      }

      // Create or update email account
      const emailAccount = await EmailAccount.findOne({
        where: { 
          email: profile.emails[0].value,
          userId: user.id
        }
      });

      if (emailAccount) {
        await emailAccount.update({
          accessToken,
          refreshToken,
          tokenExpiry: new Date(Date.now() + 3600000), // 1 hour from now
          status: 'verified',
          provider: 'gmail'
        });
      } else {
        await EmailAccount.create({
          email: profile.emails[0].value,
          name: profile.displayName,
          userId: user.id,
          provider: 'gmail',
          accessToken,
          refreshToken,
          tokenExpiry: new Date(Date.now() + 3600000),
          status: 'verified'
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));

  // Serialize user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

module.exports = setupGoogleAuth; 