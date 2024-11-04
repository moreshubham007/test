module.exports = (sequelize, DataTypes) => {
  const CampaignAnalytics = sequelize.define('CampaignAnalytics', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    campaignId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Campaigns',
        key: 'id'
      }
    },
    totalOpens: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    uniqueOpens: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalClicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    uniqueClicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    bounces: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    complaints: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    unsubscribes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    clickMap: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    deviceStats: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    locationStats: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    hourlyStats: {
      type: DataTypes.JSONB,
      defaultValue: {},
    }
  });

  return CampaignAnalytics;
}; 