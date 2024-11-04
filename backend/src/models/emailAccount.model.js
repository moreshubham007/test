module.exports = (sequelize, DataTypes) => {
  const EmailAccount = sequelize.define('EmailAccount', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    provider: {
      type: DataTypes.ENUM('gmail', 'outlook'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'verified', 'blocked'),
      defaultValue: 'pending',
    },
    accessToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dailySendLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 500,
    },
    dailySendCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastSentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    settings: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
  }, {
    timestamps: true,
  });

  return EmailAccount;
}; 