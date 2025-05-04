# Troubleshooting Guide

## Overview

This troubleshooting guide provides solutions for common issues encountered when using the UPass Manager application. It's organized by feature area to help you quickly find relevant solutions.

## Login and Authentication Issues

### Cannot Log In

**Symptoms:**
- Invalid credentials error despite entering correct information
- Login page refreshes without logging in
- Blank page after login attempt

**Possible Solutions:**
1. **Verify Credentials**
   - Ensure that you're using the correct email address and password
   - Check for caps lock or typos
   - If you're a distributor, verify that your account hasn't been deactivated

2. **Clear Browser Cache**
   ```bash
   # Chrome shortcut for clearing cache
   Ctrl+Shift+Delete (Windows/Linux) or Cmd+Shift+Delete (Mac)
   ```
   - Select "Cached images and files"
   - Click "Clear data"

3. **Reset Password**
   - Contact your administrator to reset your password
   - Follow the password reset instructions sent to your email

### Session Expired Issues

**Symptoms:**
- Automatically logged out while using the application
- "Session expired" message
- Redirected to login page during operations

**Possible Solutions:**
1. **Log Back In**
   - Simply log back into the application
   
2. **Extend Session Timeout**
   - Administrators can adjust the session timeout setting
   - Default timeout is 30 minutes of inactivity

3. **Avoid Long Periods of Inactivity**
   - Regularly interact with the application to keep your session active

## Database Connection Issues

### Cannot Retrieve Student Records

**Symptoms:**
- "Error fetching data" message
- Empty student search results despite valid PID
- Error messages mentioning database connection

**Possible Solutions:**
1. **Check Database Connection**
   - Verify that your MySQL service is running
   ```bash
   # Check MySQL status on Linux
   sudo systemctl status mysql
   
   # Check MySQL status on macOS
   brew services list | grep mysql
   
   # Check MySQL status on Windows
   net start | findstr MySQL
   ```
   
2. **Verify Database Credentials**
   - Check that the DB_HOST, DB_USER, DB_PASSWORD, and DB_DATABASE environment variables are correctly set
   
3. **Restart the Application**
   - Restart the Next.js server to reestablish database connections
   ```bash
   # Stop the running server with Ctrl+C, then:
   npm run dev
   ```

### Error Loading Large Data Sets

**Symptoms:**
- Timeout errors when viewing statistics
- Slow performance when searching or filtering
- Browser becomes unresponsive

**Possible Solutions:**
1. **Optimize Queries**
   - Add appropriate indexes to database tables
   - Modify API endpoints to use pagination
   
2. **Increase Timeout Settings**
   - Adjust database connection timeout in db.js
   - Increase API timeout limits
   
3. **Reduce Data Load**
   - Use more specific filters
   - Reduce the number of records fetched per page

## NFC Integration Issues

### NFC Reader Not Detected

**Symptoms:**
- "No NFC readers found" message in NFCModal
- NFC Bridge Server log shows no connected readers
- Unable to scan cards

**Possible Solutions:**
1. **Check Physical Connection**
   - Ensure the NFC reader is properly connected to your computer
   - Try a different USB port
   - Check that the reader has power (indicator light)
   
2. **Verify NFC Bridge Server**
   - Make sure the NFC Bridge Server is running
   ```bash
   # From project root
   cd src/nfc-bridge
   npm start
   ```
   
3. **Run Diagnostic Tool**
   ```bash
   # From project root
   cd src/nfc-bridge
   node check-reader.js
   ```
   - This will check if the PC/SC system can detect your reader
   
4. **Reinstall PC/SC Middleware**
   - Windows: PC/SC comes pre-installed
   - macOS: `brew install pcsc-lite`
   - Linux: `sudo apt-get install pcscd libpcsclite-dev`

### Card Reading Problems

**Symptoms:**
- Card is not detected when placed on the reader
- Inconsistent card detection
- Incorrect card numbers

**Possible Solutions:**
1. **Position the Card Correctly**
   - Place the card directly on the center of the reader
   - Keep the card still during reading
   - Ensure there are no other NFC cards nearby
   
2. **Check Card Compatibility**
   - Verify the card is a compatible NFC card (ISO 14443 Type A/B)
   - Test with a known working card
   
3. **Restart the NFC Bridge Server**
   ```bash
   # Kill the current process and restart
   cd src/nfc-bridge
   npm start
   ```
   
4. **Update the NFC Bridge Software**
   ```bash
   # From project root
   npm run update-nfc
   ```

### WebSocket Connection Issues

**Symptoms:**
- "Cannot connect to NFC server" error
- NFCModal shows disconnected status
- NFC reader is detected but not sending data

**Possible Solutions:**
1. **Check Server URL Configuration**
   - Verify the NEXT_PUBLIC_NFC_SERVER_URL environment variable is set correctly
   - Default should be `http://localhost:3001`
   
2. **Check for Port Conflicts**
   - Ensure no other service is using port 3001
   ```bash
   # Check if port 3001 is in use on Linux/macOS
   lsof -i :3001
   
   # Check if port 3001 is in use on Windows
   netstat -ano | findstr :3001
   ```
   
3. **Restart Both Servers**
   - Restart the NFC Bridge Server
   - Restart the Next.js development server

## Email Notification Issues

### Notifications Not Sending

**Symptoms:**
- "Error sending notification" message
- No error, but recipients don't receive emails
- AWS Lambda errors in console

**Possible Solutions:**
1. **Check AWS Credentials**
   - Verify that AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY environment variables are set correctly
   - Ensure the IAM user has permission to invoke Lambda and use SES
   
2. **Verify SES Configuration**
   - Check that your SES account is out of the sandbox (if sending to non-verified emails)
   - Verify that sender email is verified in SES
   
3. **Check Lambda Function Configuration**
   - Make sure the LAMBDA_FUNCTION_NAME environment variable matches your deployed function
   - Check CloudWatch logs for errors in the Lambda function
   
4. **Test with Verified Emails**
   - Initially test with emails that are verified in your SES account

### Email Template Issues

**Symptoms:**
- Emails send but with missing or incorrect personalization
- Template rendering errors
- Emails send with placeholder text

**Possible Solutions:**
1. **Check Template Format**
   - Ensure placeholders are in the correct format: `{{PLACEHOLDER_NAME}}`
   - Verify HTML syntax if using HTML templates
   
2. **Verify Data Mapping**
   - Check that student data fields match the placeholders in templates
   - Ensure special characters are properly escaped
   
3. **Test with Simplified Template**
   - Create a simple template without placeholders
   - Gradually add complexity to identify the issue

## Data Visualization Issues

### Charts Not Rendering

**Symptoms:**
- Blank spaces where charts should appear
- "Error loading chart data" message
- JavaScript console errors related to Recharts

**Possible Solutions:**
1. **Check Data Format**
   - Ensure the data is in the correct format for Recharts
   - Check for null or undefined values in the dataset
   
2. **Update Dependencies**
   ```bash
   npm update recharts
   ```
   
3. **Clear Browser Cache**
   - Clear cached JavaScript files
   - Try in a different browser

### Incorrect Statistics

**Symptoms:**
- Chart percentages don't add up to 100%
- Counts don't match expected values
- Inconsistent data between different views

**Possible Solutions:**
1. **Verify Data Calculation**
   - Check the data processing functions in the UPassCollectionStats component
   - Ensure filters are applied correctly
   
2. **Refresh Data Source**
   - Use the refresh button to fetch the latest data
   - Clear browser cache and reload the page
   
3. **Check Database Consistency**
   - Verify that the database tables have consistent and up-to-date information
   - Run data validation queries to find inconsistencies

## Performance Issues

### Slow Page Loading

**Symptoms:**
- Pages take a long time to load
- Browser becomes unresponsive
- Timeout errors

**Possible Solutions:**
1. **Optimize Data Fetching**
   - Implement pagination for large data sets
   - Use server-side filtering to reduce data transfer
   
2. **Check Network Performance**
   - Use browser DevTools to analyze network requests
   - Look for slow API calls or large response sizes
   
3. **Increase Resource Allocation**
   - If self-hosting, increase memory and CPU resources
   - Consider performance-optimized hosting options

### Browser Memory Issues

**Symptoms:**
- Browser crashes when using the application for extended periods
- Error messages about memory
- Gradual slowdown over time

**Possible Solutions:**
1. **Implement Proper Cleanup**
   - Use useEffect cleanup functions in React components
   - Dispose of subscriptions and event listeners properly
   
2. **Optimize React Component Rendering**
   - Use React.memo for components that render frequently
   - Implement useMemo and useCallback for expensive operations
   
3. **Regular Browser Refreshes**
   - For long sessions, periodically refresh the browser
   - Close unused tabs to free up memory

## Installation and Setup Issues

### Environment Setup Problems

**Symptoms:**
- Error messages during npm install
- Missing dependencies errors
- Environment variable not found errors

**Possible Solutions:**
1. **Clean Install**
   ```bash
   rm -rf node_modules
   npm cache clean --force
   npm install
   ```
   
2. **Check Node.js Version**
   ```bash
   node -v
   ```
   - Ensure you're using Node.js v14 or higher
   - If not, install an appropriate version using nvm
   
3. **Verify Environment Variables**
   - Check that all required variables are in your .env file
   - Make sure Next.js can access the variables (prefix with NEXT_PUBLIC_ for client-side use)

### Build and Deployment Errors

**Symptoms:**
- Build fails with error messages
- Application deploys but doesn't run correctly
- Missing functionality in production

**Possible Solutions:**
1. **Check Build Logs**
   - Review npm build logs for specific errors
   - Address any TypeScript or ESLint errors
   
2. **Verify Production Configuration**
   - Make sure environment variables are correctly set in production
   - Check that all required services (database, AWS) are accessible from the production environment
   
3. **Incremental Troubleshooting**
   - Deploy a minimal version of the application
   - Add features incrementally to identify problematic code

## Contact Support

If you continue to experience issues after trying the solutions in this guide, please contact the UPass Manager support team:

- **Email**: upass-support@vt.edu
- **Internal Ticketing System**: https://helpdesk.vt.edu (for Virginia Tech staff)

When reporting an issue, please include:
- Detailed description of the problem
- Steps to reproduce the issue
- Screenshots or error messages
- Your environment details (browser, operating system)