# UPass Manager User Guide

This comprehensive guide explains how to use the UPass Manager system based on your role. It covers all functionality from basic navigation to advanced administrative tasks.

## User Roles

The UPass Manager system has three primary user roles:

1. **Student**: End users who receive U-Pass cards
2. **Distributor**: Staff who issue U-Pass cards to students
3. **Administrator**: Staff who manage the system and generate reports

## Common Features

### Logging In

1. Visit the UPass Manager login page at your institution's URL
2. Enter your credentials (email and password)
3. For first-time users, you may need to set up a password using the link sent to your email
4. The system will direct you to the appropriate dashboard based on your role

### Navigation

The main navigation menu includes:
- Dashboard: Overview of key information
- Search: Find student records or U-Pass cards
- Reports: Access to statistical data and analytics
- Settings: Configure your account preferences

### Account Management

1. Click on your profile icon in the top-right corner
2. Select "Profile" to update your personal information
3. Select "Security" to change your password or configure two-factor authentication
4. Select "Preferences" to adjust notification settings

## Student Role

### Checking Eligibility Status

1. Log in to the UPass Manager portal using your university credentials
2. The dashboard will display your eligibility status prominently
3. Green status indicates you are eligible for a U-Pass
4. Yellow status indicates pending eligibility
5. Red status indicates you are not currently eligible
6. If you believe there's an error, use the "Report Issue" button

### Receiving U-Pass Notifications

1. Ensure your email address is current in your profile settings
2. You will receive email notifications for important events:
   - U-Pass eligibility confirmation
   - Distribution date announcements
   - Pickup reminders
   - Expiration warnings
   - Replacement information

### Picking Up Your U-Pass

1. After receiving notification that your U-Pass is ready:
2. Visit the designated distribution center during operating hours
3. Present your student ID and a secondary photo ID if required
4. The distributor will scan your ID and verify your eligibility
5. Sign the U-Pass disclaimer form electronically
6. Receive your U-Pass card

### Managing Your U-Pass

1. Navigate to the "My U-Pass" section
2. View your current U-Pass details:
   - Card number
   - Issue date
   - Expiration date
   - Status (active, expired, replaced)
3. Report issues with your U-Pass using the "Report Problem" button

### Reporting Lost or Stolen U-Pass

1. Log in to the UPass Manager portal
2. Navigate to the "My U-Pass" section
3. Click on "Report Lost/Stolen"
4. Complete the loss/theft form
5. Submit the form to request a replacement
6. You will receive instructions for obtaining a replacement card

## Distributor Role

### Dashboard Overview

After logging in, the distributor dashboard displays:
- Daily distribution statistics
- Pending student requests
- Card inventory status
- Recent activity log
- Quick access buttons for common tasks

### Student Search

1. Click the "Search" button in the navigation menu
2. Enter a student's ID number, name, or email
3. View the student's record, including:
   - Personal information
   - Eligibility status
   - U-Pass history
   - Current U-Pass status

### Verifying Student Eligibility

1. From the distributor dashboard, click "Verify Eligibility"
2. Scan the student's ID card using the connected reader or enter their ID number
3. The system will display the student's eligibility status:
   - Green: Eligible – proceed with issuing
   - Yellow: Pending – contact administrator
   - Red: Not eligible – cannot issue U-Pass

### Issuing U-Pass Cards

1. After verifying eligibility, click "Issue U-Pass"
2. If the student hasn't signed the disclaimer:
   - Explain the disclaimer terms
   - Have the student sign electronically
   - Check the "Disclaimer Signed" box
3. Scan the new U-Pass card using the NFC reader
   - The system will automatically capture the card number
   - Alternatively, enter the card number manually
4. Click "Allocate U-Pass"
5. Confirm the issuance when prompted
6. The system will:
   - Update the student's record
   - Send a confirmation email
   - Add the transaction to the distribution log

### Handling Replacements

For lost, stolen, or damaged cards:
1. Search for the student's record
2. Verify their identity
3. Click "Replace U-Pass"
4. Select the replacement reason
5. Scan the new card
6. The system will automatically:
   - Deactivate the old card
   - Record the replacement in the history
   - Update the student's record with the new card information

### Batch Processing

For efficient distribution at the start of semesters:
1. Navigate to "Batch Operations"
2. Select "Batch Issue"
3. Upload a spreadsheet of eligible students or filter by criteria
4. For each student in the queue:
   - Verify identity
   - Scan U-Pass card
   - Confirm issuance
5. The system tracks progress and allows pause/resume functionality

### Managing Inventory

1. Navigate to the "Inventory" section
2. View current U-Pass card inventory statistics
3. Access reports on:
   - Cards issued
   - Cards in stock
   - Replacement rate
   - Distribution trends
4. Request additional cards when stock is low

## Administrator Role

### System Management

1. Access the admin dashboard using your administrator credentials
2. View comprehensive system statistics:
   - Active users by role
   - Distribution rates
   - System performance metrics
   - Error logs
3. Manage user accounts:
   - Create new distributor accounts
   - Edit user permissions
   - Deactivate accounts
   - Reset passwords
4. Configure system settings:
   - Email templates
   - Disclaimer text
   - Notification parameters
   - Security policies

### Data Management

1. Navigate to the "Data Management" section
2. Import student data:
   - Upload CSV/Excel files from university systems
   - Configure field mapping
   - Run validation checks
   - Review and approve imports
3. Manage data cleanup:
   - Identify duplicate records
   - Correct data inconsistencies
   - Merge records if needed
4. Configure data retention policies

### Advanced Reporting

1. Access the "Reports" section
2. Generate standard reports:
   - Distribution by location
   - Distribution by time period
   - Replacement statistics
   - Eligibility breakdown
   - Usage analytics
3. Create custom reports:
   - Select data fields
   - Set filters and parameters
   - Choose visualization options
   - Schedule automatic generation
4. Export reports in multiple formats:
   - PDF for presentation
   - Excel for data analysis
   - CSV for data integration
   - JSON for API consumption

### System Monitoring and Maintenance

1. Navigate to the "System" section
2. Monitor:
   - Server performance
   - Database status
   - API response times
   - Error rates
3. Manage system maintenance:
   - Schedule updates
   - Backup configurations
   - Archive old data
   - Optimize performance

### Audit and Compliance

1. Access the "Audit" section
2. Review detailed logs of:
   - User activity
   - Data changes
   - Authentication attempts
   - Administrative actions
3. Generate compliance reports
4. Configure retention policies for audit data

## Troubleshooting

### Card Reader Issues

1. Check physical connections
2. Ensure the NFC Bridge is running (check for the icon in system tray)
3. Try restarting the NFC Bridge service:
   ```
   cd src/nfc-bridge
   node nfc-server.js
   ```
4. Check for card reader events in the console
5. If issues persist, run the diagnostic tool:
   ```
   node check-reader.js
   ```

### Login Problems

1. Verify credentials are correct
2. Check your network connection
3. Clear browser cache and cookies
4. Try an incognito/private browsing window
5. If using SSO, ensure your institution's authentication service is working
6. Contact your administrator for password reset if needed

### Data Discrepancies

If student data appears incorrect:
1. Check when the record was last updated (timestamp shown in record view)
2. Verify against the source system if possible
3. Document the discrepancy with screenshots
4. Submit a data correction request through the "Report Issue" function
5. For urgent issues, contact the system administrator directly

### System Performance

If the system is running slowly:
1. Check your internet connection
2. Try refreshing the page
3. Close unused browser tabs
4. Clear browser cache
5. If problems persist across multiple users, contact the administrator

## Best Practices

### For Distributors

- Always verify student identity before issuing a U-Pass
- Ensure the disclaimer is signed and understood
- Log out when stepping away from your workstation
- Regularly check for system notifications and updates
- Report unusual patterns or suspicious activities
- Keep card readers clean and protected

### For Administrators

- Schedule regular data imports during off-peak hours
- Monitor system logs daily for unusual activity
- Back up configuration settings before making changes
- Test new features in a staging environment first
- Document custom configurations and reports
- Maintain a knowledge base for common issues and resolutions

## Getting Help

- In-application help: Click the "?" icon in any screen for context-specific help
- Knowledge base: Access comprehensive articles at [help.upassmanager.example.com](https://help.upassmanager.example.com)
- Support tickets: Submit through the "Support" section in the application
- Email support: Contact [support@upassmanager.example.com](mailto:support@upassmanager.example.com)
- Emergency assistance: Call the support hotline at (555) 123-4567 during business hours
