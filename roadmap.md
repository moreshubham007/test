# Roadmap for Email Campaign Scheduler App

## Overview
This project is an email campaign scheduler hosted in the cloud, with OAuth integration for Gmail, Outlook, and server-based email IDs. Users can configure and manage unlimited email sender IDs, create campaigns, and send follow-up emails with customizable intervals. The app provides key features like email preview, global blocking, and customizable drip campaigns with user-assigned delays.

## Key Features
1. **Email Account Management**
   - OAuth integration for Gmail, Outlook, and server-based email IDs.
   - Add/manage unlimited email sender IDs.
   - Display email IDs in a dashboard for easy management.

2. **Campaign Creation**
   - Upload recipient details (e.g., CSV files).
   - Assign email templates to each campaign.
   - Schedule follow-up emails for each recipient.
   - Customize the time gap between each email (e.g., first email, first follow-up, etc.).
   - User-assigned drip delays for emails (e.g., user can specify a random range like 3-5 minutes).
   - Support for different templates for follow-up emails.

3. **Email Sending & Drip Campaigns**
   - Send emails based on a predefined schedule with user-assigned random delays between emails.
   - Drip emails with random intervals based on user-defined ranges (e.g., user assigns a range like 3-5 minutes).
   - Start campaigns at user-defined dates and times.

4. **Global Blocking**
   - Block email sending to any recipient or domain that replies to any email.
   - Manage blocking rules in a central dashboard.
   - Ensure no follow-ups are sent after a reply.

5. **Preview & Verification**
   - Preview campaigns before launching.
   - Verify mail merge settings (recipient, email ID, template).
   
6. **Campaign Tracking**
   - Monitor email sending success rates (deliveries, bounces, replies).
   - Generate reports for each campaign.

## Architecture Plan
### 1. **Frontend (UI/UX)**
   - Simple dashboard for managing email IDs, campaigns, and settings.
   - Pages: 
     - Email ID management
     - Campaign creation and preview
     - Reports and analytics
     - Global blocking management

### 2. **Backend**
   - **Email Campaign Service**: Handles scheduling and email sending.
   - **OAuth Integration Service**: Manages secure OAuth connections for Gmail, Outlook, and server-based email IDs.
   - **Follow-up Logic**: Automates follow-up emails with time gaps and user-assigned random delays.
   - **Global Blocking Service**: Manages blocking logic for replies.
   - **Drip Logic**: Implements random delay between emails based on user-assigned time ranges.
   - **Database**: Stores campaign details, email templates, schedules, user data, and blocking rules.

### 3. **Security**
   - OAuth 2.0 for secure authentication with Gmail, Outlook, and server email services.
   - Data encryption at rest and in transit.
   - Regular security updates.

## Milestones

### Phase 1: Setup & Basic Infrastructure (Weeks 1-2)
- Set up cloud environment (AWS/Azure).
- Implement OAuth integration for Gmail, Outlook, and server email IDs.
- Design database schema (store email accounts, campaigns, recipients, templates).
- Build basic UI for email ID management and campaign creation.

### Phase 2: Campaign Management & Scheduling (Weeks 3-4)
- Create backend services for managing email campaigns.
- Develop UI for uploading recipient details and templates.
- Implement follow-up scheduling logic, including user-assigned random drip delays.

### Phase 3: Drip Campaigns & Global Blocking (Weeks 5-6)
- Implement user-assigned drip email logic (random time gaps).
- Build global blocking feature.
- Add UI for previewing campaigns and verifying mail merges.

### Phase 4: Email Sending & Tracking (Weeks 7-8)
- Integrate email sending functionality.
- Add email delivery tracking (bounces, replies, success rates).
- Build reporting dashboard for users.

### Phase 5: Testing & Launch (Weeks 9-10)
- Conduct end-to-end testing for campaign management, sending, and reporting.
- Ensure all blocking, drip, and follow-up features work as expected.
- Launch the application.

## Future Enhancements
- Advanced analytics for email engagement (opens, clicks).
- Add tagging and categorization for campaigns and recipients.
