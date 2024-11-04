const { User, EmailAccount, Template, Campaign } = require('../models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
      status: 'active'
    });

    // Create sample email account
    const emailAccount = await EmailAccount.create({
      email: 'test.sender@example.com',
      name: 'Test Sender',
      provider: 'smtp',
      status: 'verified',
      userId: testUser.id,
      dailySendLimit: 100
    });

    // Create sample template
    const template = await Template.create({
      name: 'Welcome Email',
      subject: 'Welcome to our service!',
      content: `
        <h1>Welcome!</h1>
        <p>Thank you for joining our service. We're excited to have you!</p>
        <p>Best regards,<br>The Team</p>
      `,
      variables: ['name', 'company'],
      category: 'onboarding',
      isPublic: true,
      userId: testUser.id
    });

    // Create sample campaign
    const campaign = await Campaign.create({
      name: 'Welcome Campaign',
      subject: 'Welcome to our platform',
      content: template.content,
      status: 'draft',
      userId: testUser.id,
      settings: {
        retryCount: 3,
        throttleRate: 10
      }
    });

    console.log('Seed data created successfully!');
    console.log('\nTest User Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

// Run the seed function
seed(); 