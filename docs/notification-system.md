# Notification System Documentation

## Overview
The Notification System in U-Pass Manager enables administrators and distributors to send automated and manual notifications to students regarding their U-Pass status, eligibility changes, pickup reminders, and other important information. The system uses AWS Lambda and SES (Simple Email Service) to handle email delivery reliably and securely.

## Key Features

- **Template-Based Notifications**: Pre-defined message templates for common communication needs
- **Batch Notifications**: Send notifications to multiple students at once
- **Student Filtering**: Select recipients based on various criteria
- **AWS SES Integration**: Scalable email delivery through Amazon SES
- **Delivery Tracking**: Monitor notification delivery and status
- **Custom Message Creation**: Create and save custom notification templates

## System Architecture

```
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│               │    │               │    │               │
│ UPass Manager │───▶│ AWS Lambda    │───▶│ AWS SES       │───▶ Student Emails
│ Application   │    │ Function      │    │               │
│               │    │               │    │               │
└───────────────┘    └───────────────┘    └───────────────┘
```

## Notification Types

1. **U-Pass Ready for Pickup**
   - Sent when a U-Pass has been allocated to a student
   - Includes pickup location and hours information

2. **Disclaimer Required**
   - Notifies students who haven't signed the required disclaimer
   - Includes a link or instructions for signing electronically

3. **Eligibility Status Change**
   - Alerts students to changes in their eligibility status
   - Provides reasons for changes and next steps

4. **U-Pass Expiration/Renewal**
   - Reminder about upcoming U-Pass expiration
   - Instructions for renewal process

5. **General Announcements**
   - System-wide announcements and updates
   - Important information about the U-Pass program

## User Interface Components

- **Notifications Page**: Main interface for creating and sending notifications
- **Template Selection**: Dropdown for selecting pre-defined templates
- **Recipient Filters**: Controls for filtering which students will receive notifications
- **Message Editor**: Interface for customizing notification content
- **Preview Function**: See how the message will appear to recipients
- **Send Controls**: Options for scheduling and sending notifications

## Implementation Details

### Technology Stack
- **Frontend**: React with Next.js
- **Backend Processing**: AWS Lambda
- **Email Delivery**: AWS SES (Simple Email Service)
- **Database**: MySQL for storing templates and tracking

### Data Flow
1. Administrator selects recipients and notification template
2. System builds the email content with personalized fields
3. Notification request is sent to AWS Lambda function
4. Lambda processes the request and uses SES to send emails
5. Delivery status is updated in the database

### Message Templates
Templates are stored in the `message_templates` database table with the following structure:
- `id`: Unique identifier
- `name`: Template name
- `subject`: Email subject line
- `body`: Email body content (supports HTML and placeholders)
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Personalization Placeholders
Templates support the following placeholders that are replaced with actual data:
- `{{STUDENT_NAME}}`: Student's full name
- `{{FIRST_NAME}}`: Student's first name
- `{{LAST_NAME}}`: Student's last name
- `{{PID}}`: Student ID (masked for security)
- `{{EMAIL}}`: Student's email address
- `{{UPASS_NUMBER}}`: Active U-Pass card number (masked for security)
- `{{DISTRIBUTION_DATE}}`: Date the U-Pass was distributed

## Security and Compliance

- **Email Privacy**: Batch emails use BCC to protect student privacy
- **Data Protection**: Sensitive data is masked in templates
- **Opt-Out Mechanism**: All emails include unsubscribe instructions
- **Compliance**: System adheres to university communication policies and CAN-SPAM Act
- **Rate Limiting**: Prevents abuse by limiting notification volume

## AWS Lambda Configuration

The notification system uses AWS Lambda with the following configuration:
- **Function Name**: `CS5934_G6_SES` (configurable in environment variables)
- **Runtime**: Node.js 14.x
- **Memory**: 128 MB
- **Timeout**: 30 seconds
- **Handler**: `index.handler`
- **Environment Variables**:
  - `SES_REGION`: AWS region for SES
  - `FROM_EMAIL`: Sender email address
  - `REPLY_TO_EMAIL`: Reply-to email address

## Usage Examples

### Sending Pickup Notifications to Eligible Students
1. Navigate to the Notifications page
2. Select "U-Pass Ready for Pickup" template
3. Filter for students with allocated U-Pass cards
4. Preview the message
5. Click "Send Notifications"

### Creating a Custom Template
1. Navigate to the Notifications page
2. Click "Create New Template"
3. Enter template name, subject, and body content
4. Use placeholders for personalized content
5. Save the template for future use

## Troubleshooting

### Common Issues
- **Emails Not Delivered**: Check AWS SES sending limits and bounce rates
- **Lambda Function Errors**: Review CloudWatch logs for error details
- **Template Errors**: Ensure placeholders are correctly formatted
- **Rate Limiting**: Large batches may be throttled for delivery over time

### Logging and Monitoring
- All notification activities are logged for audit purposes
- AWS CloudWatch monitors Lambda function performance
- SES delivery metrics are available in the AWS console

## Related Components

- `Notifications.js`: Main component for the notification interface
- `MessageTemplateModal.js`: Component for managing message templates
- `send-notification.js`: API endpoint for triggering notifications
- `message-templates.js`: API endpoint for managing templates
- AWS Lambda function code in `src/cloud/lambda-code/`