# UPass Manager Documentation

## Overview

The UPass Manager is a comprehensive web application designed for modernizing the distribution and management of UPass cards at Virginia Tech. This document provides a detailed overview of the system architecture, focusing on the integration of AWS cloud services and NFC technology.

## System Architecture

The UPass Manager employs a modern architecture that combines cloud services with local hardware integration:

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     UPass Manager Application                    │
├─────────────┬───────────────────────────────┬───────────────────┤
│             │                               │                   │
│  Frontend   │           Backend             │  NFC Integration  │
│  (Next.js)  │     (API Routes & DB)         │                   │
│             │                               │                   │
└─────┬───────┴─────────────┬─────────────────┴─────────┬─────────┘
      │                     │                           │
      ▼                     ▼                           ▼
┌─────────────┐    ┌───────────────────┐     ┌───────────────────┐
│             │    │                   │     │                   │
│   User      │    │  AWS Services     │     │  NFC Hardware     │
│  Interface  │    │                   │     │                   │
│             │    │                   │     │                   │
└─────────────┘    └───────────────────┘     └───────────────────┘
```

### Component Interaction

The UPass Manager integrates several components that work together to provide a comprehensive solution:

1. **Frontend (Next.js)**: The user interface for administrators, distributors, and students
2. **Backend API (Next.js API Routes)**: Processes requests and communicates with the database
3. **Database (MySQL on Amazon RDS)**: Stores all application data
4. **AWS Services**: Provides cloud functionality for data processing and notifications
5. **NFC Integration**: Enables physical card reading and allocation

## AWS Services Integration

The UPass Manager leverages four key AWS services to enhance its functionality:

### 1. AWS Lambda

**Purpose**: Provides serverless computing for data processing and email notifications.

**Components**:
- **File Processor Lambda** (`src/cloud/lambda-code/lambda_handler.mjs`): Processes Excel files uploaded to S3
- **Email Notification Lambda** (`src/cloud/lambda-code 2/index.js`): Sends email notifications to students

**Integration Points**:
- Triggered by S3 file uploads
- Invoked directly by the application for sending notifications
- Interacts with both RDS and SES

### 2. Amazon RDS

**Purpose**: Provides a managed relational database for storing all UPass Manager data.

**Key Tables**:
- `u_pass_manager_current`: Current semester UPass data
- `u_pass_manager_fall_2024`: Fall 2024 semester UPass data
- `u_pass_manager_spring_2024`: Spring 2024 semester UPass data

**Integration Points**:
- Connected to by backend API for direct CRUD operations
- Updated by Lambda functions when processing uploaded files
- Stores student records, card data, and distribution information

### 3. Amazon S3

**Purpose**: Stores uploaded Excel files containing UPass data.

**Bucket Structure**:
- `raw_data/`: Contains uploaded Excel files that trigger Lambda processing

**Integration Points**:
- Files are uploaded directly from the admin dashboard
- File uploads trigger the File Processor Lambda function
- Provides durable storage for all data files

### 4. Amazon SES

**Purpose**: Sends email notifications to students about their UPass status.

**Configuration**:
- Uses verified sender email: `gettingaround@vt.edu`
- Handles notification delivery to students

**Integration Points**:
- Invoked by the Email Notification Lambda function
- Sends notifications for eligibility changes, pickup reminders, etc.

## NFC Integration

The NFC integration allows for physical card reading and allocation in the UPass Manager system:

### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  NFC Card       │────▶│  NFC Bridge     │────▶│  UPass Manager  │
│  Reader         │     │  Server         │     │  Application    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
       PC/SC API              WebSocket            React Component
```

### Components:

1. **NFC Bridge Server** (`src/nfc-bridge/nfc-server.js`): A Node.js server that communicates with NFC card readers
2. **WebSocket Connection**: Real-time communication channel between the server and application
3. **NFCModal Component** (`src/app/components/NFCModal.js`): UI for allocating UPass cards

### Integration with AWS Services:

When a card is scanned and allocated through the NFC interface:
1. The card data is sent to the application via WebSocket
2. The application sends the data to the backend API
3. The API updates the RDS database with the new allocation
4. If configured, a notification can be triggered via Lambda and SES

## Data Flow

### UPass Allocation Flow

1. **Card Request Initiation**:
   - Distributor searches for a student by PID in the dashboard
   - Distributor verifies the student is eligible and has signed the disclaimer
   - Distributor clicks "Allocate UPass" to open the NFC modal

2. **Card Scanning**:
   - NFC Bridge Server detects when a card is placed on the reader
   - Card UID is read and formatted
   - Card data is sent to the NFCModal component via WebSocket

3. **Allocation and Database Update**:
   - Distributor confirms the allocation
   - Application sends allocation request to API
   - API updates RDS database with card information
   - If it's a replacement card, the previous card is marked as replaced

4. **Notification**:
   - Optionally, a notification Lambda function is triggered
   - Lambda uses SES to send an email to the student
   - Email notifies the student that their UPass has been allocated

### Data Import Flow

1. **File Upload**:
   - Administrator uploads an Excel file containing student data
   - File is stored in the S3 bucket under the `raw_data/` folder

2. **Data Processing**:
   - S3 upload triggers the File Processor Lambda function
   - Lambda retrieves the file from S3
   - Lambda parses the Excel data
   - Lambda connects to RDS and updates the appropriate table

## Deployment and Setup

### AWS Services Setup

1. **Set Up Environment Variables**:
   ```
   AWS_REGION=us-east-2
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   LAMBDA_FUNCTION_NAME=CS5934_G6_SES
   ```

2. **RDS Configuration**:
   ```
   RDS_HOST=your_database_host
   RDS_USER=your_database_user
   RDS_PASSWORD=your_database_password
   RDS_DB=your_database_name
   ```

### NFC Integration Setup

1. **Install NFC Bridge**:
   ```bash
   npm run setup-nfc
   ```

2. **Start NFC Bridge Server**:
   ```bash
   npm run nfc-server
   ```

3. **Configure WebSocket URL**:
   ```
   NEXT_PUBLIC_NFC_SERVER_URL=http://localhost:3001
   ```

## Security Considerations

1. **AWS Security**:
   - IAM roles with least privilege principle
   - Sensitive information stored in environment variables
   - SES with verified email addresses
   - S3 with appropriate bucket policies

2. **NFC Security**:
   - NFC Bridge Server runs locally
   - WebSocket accessible only from local machine
   - No sensitive data stored in NFC Bridge

## Troubleshooting

### AWS Services Issues

1. **Lambda Function Failures**:
   - Check CloudWatch logs for detailed error messages
   - Verify environment variables and permissions
   - Ensure S3 triggers are properly configured

2. **Database Connection Issues**:
   - Verify RDS connection parameters
   - Check security group settings
   - Test connection from Lambda environment

### NFC Integration Issues

1. **Card Reader Connection**:
   - Ensure PC/SC middleware is installed
   - Verify reader is connected and recognized
   - Check NFC Bridge Server logs

2. **Card Reading Problems**:
   - Try different card positioning
   - Verify card compatibility
   - Restart the NFC Bridge Server

## Future Enhancements

1. **AWS Services Enhancements**:
   - Add AWS CloudWatch for monitoring and alerting
   - Implement AWS Cognito for enhanced authentication
   - Add AWS WAF for improved security

2. **NFC Integration Enhancements**:
   - Support for additional card reader types
   - Encrypted WebSocket communication
   - Batch scanning mode

## Conclusion

The UPass Manager system demonstrates a modern approach to application architecture by combining cloud services (AWS Lambda, RDS, S3, and SES) with local hardware integration (NFC card readers). This hybrid approach provides the benefits of cloud computing while enabling physical card interactions required for UPass distribution.

For more detailed information on specific components, please refer to:
- [AWS Integration Documentation](/docs/AWS_Integration.md)
- [NFC Integration Documentation](/docs/nfc-integration.md)
- [API Documentation](/wiki/API.md)
- [System Architecture](/wiki/Architecture.md)