module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define('Campaign', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('draft', 'scheduled', 'sending', 'sent', 'failed', 'paused'),
      defaultValue: 'draft',
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    totalRecipients: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    successfulSends: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    failedSends: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {
        retryCount: 3,
        throttleRate: 100, // emails per minute
      },
    }
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: async (campaign) => {
        if (campaign.scheduledDate && campaign.scheduledDate > new Date()) {
          campaign.status = 'scheduled';
        }
      },
    },
  });

  return Campaign;
}; 