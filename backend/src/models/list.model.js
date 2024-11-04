module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('static', 'dynamic', 'segment'),
      defaultValue: 'static',
    },
    criteria: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Filter criteria for dynamic lists/segments',
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    totalRecipients: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    hooks: {
      beforeCreate: async (list) => {
        if (list.type === 'dynamic') {
          // Validate criteria format
          if (!list.criteria || Object.keys(list.criteria).length === 0) {
            throw new Error('Dynamic lists require filter criteria');
          }
        }
      }
    }
  });

  return List;
}; 