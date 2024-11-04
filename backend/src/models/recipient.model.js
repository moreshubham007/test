module.exports = (sequelize, DataTypes) => {
  const Recipient = sequelize.define('Recipient', {
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
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    status: {
      type: DataTypes.ENUM('active', 'unsubscribed', 'bounced'),
      defaultValue: 'active',
    },
    lastEmailSentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    bounceCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    }
  });

  return Recipient;
}; 