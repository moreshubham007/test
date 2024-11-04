const { google } = require('googleapis');

class GmailService {
  constructor() {
    this.gmail = null;
    this.oauth2Client = null;
  }

  async initialize(credentials) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    this.oauth2Client.setCredentials(credentials);
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
  }

  async getDrafts() {
    try {
      const response = await this.gmail.users.drafts.list({
        userId: 'me'
      });
      return response.data.drafts || [];
    } catch (error) {
      console.error('Failed to fetch drafts:', error);
      throw error;
    }
  }

  async getLabels() {
    try {
      const response = await this.gmail.users.labels.list({
        userId: 'me'
      });
      return response.data.labels || [];
    } catch (error) {
      console.error('Failed to fetch labels:', error);
      throw error;
    }
  }

  async createDraft({ to, subject, content }) {
    try {
      const messageParts = [
        `To: ${to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${subject}`,
        '',
        content
      ];

      const message = messageParts.join('\n');
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await this.gmail.users.drafts.create({
        userId: 'me',
        requestBody: {
          message: {
            raw: encodedMessage
          }
        }
      });

      return response.data;
    } catch (error) {
      console.error('Failed to create draft:', error);
      throw error;
    }
  }

  async sendDraft(draftId) {
    try {
      const response = await this.gmail.users.drafts.send({
        userId: 'me',
        requestBody: {
          id: draftId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send draft:', error);
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await this.gmail.users.getProfile({
        userId: 'me'
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get profile:', error);
      throw error;
    }
  }

  async getQuota() {
    try {
      const response = await this.gmail.users.getProfile({
        userId: 'me'
      });
      return {
        emailAddress: response.data.emailAddress,
        quotaUsed: response.data.quotaUsed,
        threadsTotal: response.data.threadsTotal,
        historyId: response.data.historyId
      };
    } catch (error) {
      console.error('Failed to get quota:', error);
      throw error;
    }
  }
}

module.exports = new GmailService(); 