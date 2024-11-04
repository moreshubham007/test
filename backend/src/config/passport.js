const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const OutlookStrategy = require('passport-outlook').Strategy;
const { EmailAccount } = require('../models');

const setupEmailProviders = () => {
  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let emailAccount = await EmailAccount.findOne({ where: { email } });
      
      if (!emailAccount) {
        emailAccount = await EmailAccount.create({
          email,
          provider: 'google',
          accessToken,
          refreshToken
        });
      } else {
        await emailAccount.update({ accessToken, refreshToken });
      }
      
      return done(null, emailAccount);
    } catch (error) {
      return done(error);
    }
  }));

  // Outlook OAuth Strategy
  passport.use(new OutlookStrategy({
    clientID: process.env.OUTLOOK_CLIENT_ID,
    clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
    callbackURL: "/auth/outlook/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let emailAccount = await EmailAccount.findOne({ where: { email } });
      
      if (!emailAccount) {
        emailAccount = await EmailAccount.create({
          email,
          provider: 'outlook',
          accessToken,
          refreshToken
        });
      } else {
        await emailAccount.update({ accessToken, refreshToken });
      }
      
      return done(null, emailAccount);
    } catch (error) {
      return done(error);
    }
  }));
};

module.exports = { setupEmailProviders }; 