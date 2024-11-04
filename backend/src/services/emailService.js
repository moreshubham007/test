const nodemailer = require('nodemailer');
const { EmailAccount } = require('../models');
const { createRateLimiter } = require('../utils/rateLimiter');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

class EmailService {
  constructor() {
    this.transporters = new Map();
    this.rateLimiters = new Map();
    this.oauth2Clients = new Map();
    this.gmailClients = new Map();
  }

  async initializeTransporter(emailAccount) {
    const config = await this.getTransporterConfig(emailAccount);
    const transporter = nodemailer.createTransport(config);
    
    try {
      await transporter.verify();
      this.transporters.set(emailAccount.id, transporter);
      
      this.rateLimiters.set(
        emailAccount.id,
        createRateLimiter(emailAccount.dailySendLimit)
      );
      
      return true;
    } catch (error) {
      console.error(`Failed to initialize transporter for ${emailAccount.email}:`, error);
      return false;
    }
  }

  async getTransporterConfig(emailAccount) {
    switch (emailAccount.provider) {
      case 'gmail': {
        const oauth2Client = await this.getGoogleOAuth2Client(emailAccount);
        return {
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: emailAccount.email,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: emailAccount.refreshToken,
            accessToken: emailAccount.accessToken,
            expires: emailAccount.tokenExpiry?.getTime() || 0
          }
        };
      }
      case 'outlook':
        return {
          host: 'smtp.office365.com',
          port: 587,
          secure: false,
          auth: {
            type: 'OAuth2',
            user: emailAccount.email,
            clientId: process.env.OUTLOOK_CLIENT_ID,
            clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
            refreshToken: emailAccount.refreshToken,
            accessToken: emailAccount.accessToken,
            expires: emailAccount.tokenExpiry?.getTime() || 0
          }
        };
      default:
        throw new Error('Unsupported email provider');
    }
  }

  async getGoogleOAuth2Client(emailAccount) {
    const oauth2Client = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: emailAccount.refreshToken,
      access_token: emailAccount.accessToken,
      expiry_date: emailAccount.tokenExpiry?.getTime() || 0
    });

    this.oauth2Clients.set(emailAccount.id, oauth2Client);
    return oauth2Client;
  }

  async initializeGmailAPI(emailAccount) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: emailAccount.accessToken,
      refresh_token: emailAccount.refreshToken,
      expiry_date: emailAccount.tokenExpiry?.getTime()
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    this.gmailClients.set(emailAccount.id, { gmail, oauth2Client });
    
    return { gmail, oauth2Client };
  }

  async sendEmailViaGmailAPI(emailAccount, { to, subject, text, html }) {
    let { gmail, oauth2Client } = this.gmailClients.get(emailAccount.id) || 
      await this.initializeGmailAPI(emailAccount);

    try {
      // Create email content in base64 format
      const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
      const messageParts = [
        `From: ${emailAccount.name} <${emailAccount.email}>`,
        `To: ${to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        html || text
      ];
      const message = messageParts.join('\n');
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Send email
      const res = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      return res.data;
    } catch (error) {
      if (error.code === 401) {
        // Token expired, refresh and retry
        await this.refreshGmailToken(emailAccount, oauth2Client);
        return this.sendEmailViaGmailAPI(emailAccount, { to, subject, text, html });
      }
      throw error;
    }
  }

  async refreshGmailToken(emailAccount, oauth2Client) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      await emailAccount.update({
        accessToken: credentials.access_token,
        tokenExpiry: new Date(credentials.expiry_date)
      });
      
      oauth2Client.setCredentials(credentials);
    } catch (error) {
      console.error('Failed to refresh Gmail token:', error);
      throw error;
    }
  }

  async sendEmail(emailAccount, { to, subject, text, html, campaignId }) {
    const rateLimiter = this.rateLimiters.get(emailAccount.id) || 
      createRateLimiter(emailAccount.dailySendLimit);
    
    if (!rateLimiter.tryAcquire()) {
      throw new Error('Rate limit exceeded');
    }

    try {
      let result;
      if (emailAccount.provider === 'gmail') {
        result = await this.sendEmailViaGmailAPI(emailAccount, { to, subject, text, html });
      } else {
        // Use existing Nodemailer logic for other providers
        const transporter = this.transporters.get(emailAccount.id) || 
          await this.initializeTransporter(emailAccount);
        
        result = await transporter.sendMail({
          from: `"${emailAccount.name || 'Email Campaign'}" <${emailAccount.email}>`,
          to,
          subject,
          text,
          html,
        });
      }

      // Update send count
      await emailAccount.increment('dailySendCount');
      await emailAccount.update({ lastSentAt: new Date() });

      return result;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async refreshToken(emailAccount) {
    try {
      if (emailAccount.provider === 'gmail') {
        const oauth2Client = this.oauth2Clients.get(emailAccount.id);
        const { credentials } = await oauth2Client.refreshAccessToken();
        
        await emailAccount.update({
          accessToken: credentials.access_token,
          tokenExpiry: new Date(credentials.expiry_date)
        });
      } else if (emailAccount.provider === 'outlook') {
        // Implement Outlook token refresh logic
        // Using Microsoft Graph API
      }

      // Reinitialize transporter with new tokens
      await this.initializeTransporter(emailAccount);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();