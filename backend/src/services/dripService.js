const emailService = require('./emailService');
const { Campaign, EmailAccount } = require('../models');

class DripService {
  constructor() {
    this.activeJobs = new Map();
  }

  randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async startDripCampaign(campaign, emailAccount) {
    try {
      // Update campaign status
      await campaign.update({ status: 'sending' });

      const recipients = await campaign.getRecipients();
      const settings = campaign.settings || {};
      
      const {
        minDelay = 60000,  // 1 minute
        maxDelay = 300000, // 5 minutes
        batchSize = 10,    // Number of emails per batch
        batchInterval = 3600000 // 1 hour between batches
      } = settings;

      // Create batches of recipients
      const batches = this.createBatches(recipients, batchSize);
      
      // Store job information for potential cancellation
      const jobInfo = {
        campaignId: campaign.id,
        timeouts: [],
        status: 'running'
      };
      this.activeJobs.set(campaign.id, jobInfo);

      // Process each batch
      for (let [batchIndex, batch] of batches.entries()) {
        const batchTimeout = setTimeout(async () => {
          try {
            await this.processBatch(
              batch, 
              campaign, 
              emailAccount, 
              minDelay, 
              maxDelay,
              jobInfo
            );

            // Check if this is the last batch
            if (batchIndex === batches.length - 1) {
              await this.finalizeCampaign(campaign);
            }
          } catch (error) {
            console.error(`Error processing batch ${batchIndex}:`, error);
            await this.handleBatchError(campaign, error);
          }
        }, batchIndex * batchInterval);

        jobInfo.timeouts.push(batchTimeout);
      }

      return true;
    } catch (error) {
      console.error('Failed to start drip campaign:', error);
      await campaign.update({ 
        status: 'failed',
        error: error.message 
      });
      return false;
    }
  }

  createBatches(recipients, batchSize) {
    const batches = [];
    for (let i = 0; i < recipients.length; i += batchSize) {
      batches.push(recipients.slice(i, i + batchSize));
    }
    return batches;
  }

  async processBatch(recipients, campaign, emailAccount, minDelay, maxDelay, jobInfo) {
    for (let [index, recipient] of recipients.entries()) {
      if (jobInfo.status === 'cancelled') {
        break;
      }

      const timeout = setTimeout(async () => {
        try {
          await emailService.sendEmail(emailAccount, {
            to: recipient.email,
            subject: campaign.subject,
            html: campaign.content,
            campaignId: campaign.id
          });

          // Update campaign stats
          await campaign.increment('successfulSends');
        } catch (error) {
          console.error(`Failed to send email to ${recipient.email}:`, error);
          await campaign.increment('failedSends');
        }
      }, this.randomDelay(minDelay, maxDelay) * index);

      jobInfo.timeouts.push(timeout);
    }
  }

  async finalizeCampaign(campaign) {
    const stats = await campaign.reload();
    const totalSent = stats.successfulSends + stats.failedSends;
    
    if (totalSent >= campaign.totalRecipients) {
      await campaign.update({
        status: 'sent',
        sentAt: new Date()
      });
      this.activeJobs.delete(campaign.id);
    }
  }

  async handleBatchError(campaign, error) {
    await campaign.update({
      status: 'failed',
      error: error.message
    });
    this.activeJobs.delete(campaign.id);
  }

  async pauseCampaign(campaignId) {
    const jobInfo = this.activeJobs.get(campaignId);
    if (jobInfo) {
      jobInfo.status = 'cancelled';
      jobInfo.timeouts.forEach(clearTimeout);
      this.activeJobs.delete(campaignId);

      const campaign = await Campaign.findByPk(campaignId);
      if (campaign) {
        await campaign.update({ status: 'paused' });
      }
      return true;
    }
    return false;
  }

  async resumeCampaign(campaignId) {
    const campaign = await Campaign.findByPk(campaignId, {
      include: [EmailAccount]
    });

    if (campaign && campaign.status === 'paused') {
      // Start a new drip campaign from where it left off
      const remainingRecipients = await campaign.getRecipients({
        where: {
          '$CampaignRecipients.status$': 'pending'
        }
      });

      campaign.totalRecipients = remainingRecipients.length;
      await campaign.save();

      return this.startDripCampaign(campaign, campaign.EmailAccount);
    }
    return false;
  }
}

module.exports = new DripService(); 