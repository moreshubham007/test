const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const db = {
  sequelize,
  Sequelize,
};

// Import models
db.User = require('./user.model')(sequelize, Sequelize);
db.Campaign = require('./campaign.model')(sequelize, Sequelize);
db.EmailAccount = require('./emailAccount.model')(sequelize, Sequelize);
db.Template = require('./template.model')(sequelize, Sequelize);
db.Recipient = require('./recipient.model')(sequelize, Sequelize);
db.List = require('./list.model')(sequelize, Sequelize);

// Define relationships
db.User.hasMany(db.Campaign);
db.Campaign.belongsTo(db.User);

db.User.hasMany(db.EmailAccount);
db.EmailAccount.belongsTo(db.User);

db.User.hasMany(db.Template);
db.Template.belongsTo(db.User);

db.Campaign.belongsToMany(db.EmailAccount, { through: 'CampaignEmails' });
db.EmailAccount.belongsToMany(db.Campaign, { through: 'CampaignEmails' });

// Campaign and Recipients relationship
db.Campaign.belongsToMany(db.Recipient, { through: 'CampaignRecipients' });
db.Recipient.belongsToMany(db.Campaign, { through: 'CampaignRecipients' });

// Template relationships
db.Campaign.belongsTo(db.Template);
db.Template.hasMany(db.Campaign);

// List relationships
db.User.hasMany(db.List);
db.List.belongsTo(db.User);

// List and Recipients relationship
db.List.belongsToMany(db.Recipient, { through: 'ListRecipients' });
db.Recipient.belongsToMany(db.List, { through: 'ListRecipients' });

module.exports = db; 