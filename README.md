# U-Pass Manager

## Overview

The U-Pass Manager is a comprehensive, cloud-based solution designed to modernize the distribution of U-Pass cards at Virginia Tech University. By automating data ingestion, eligibility verification, and pass allocation, this application replaces manual, error-prone processes with a streamlined, secure, and efficient system that delivers real-time updates and analytics.

## System Architecture

The U-Pass Manager uses a modern architecture with the following components:

- **Frontend**: Next.js-based React application for the user interface
- **Backend API**: RESTful API endpoints built with Next.js API routes
- **Database**: MySQL database for storing student and U-Pass information
- **AWS Integration**: Lambda functions for email notifications via Amazon SES
- **NFC Integration**: Bridge server for NFC card reader interaction

![Architecture Diagram](docs/images/architecture-diagram.png) <!-- Create this diagram and add it to the docs/images folder -->

## Key Features

- **Secure Login and Role-Based Access**: Multi-factor authentication and role-based access controls ensure distributors and administrators can securely manage system functionalities.

- **Eligibility Verification**: Real-time student eligibility verification using daily data updates.

- **NFC/QR Code Scanning**: Enables distributors to quickly scan NFC codes to allocate U-Pass cards to student records.

- **Real-time Notification System**: Automatically sends notifications via AWS SES to students when their U-Pass is ready for pickup, deactivated, or when their eligibility status changes.

- **Data Analytics and Dashboard**: Provides administrators with detailed insights and visualizations of U-Pass usage trends, with data export capabilities.

- **Student Record Management**: Comprehensive system for updating and maintaining student records, including disclaimer signatures, distribution dates, and pickup information.

## Technology Stack

- **Frontend**:
  - Next.js (React framework)
  - Tailwind CSS for styling
  - React Hooks for state management
  - Socket.io for real-time NFC communication

- **Backend**:
  - Next.js API routes
  - MySQL database
  - AWS Lambda and SES for notifications

- **DevOps**:
  - Git for version control
  - npm for package management

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- AWS account with SES and Lambda set up
- NFC card reader (for full functionality)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/vt-upass/upass-manager.git
   cd upass-manager
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_DATABASE=your_database_name
   DB_PORT=your_database_port
   
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=us-east-2
   LAMBDA_FUNCTION_NAME=your_lambda_function_name
   ```

4. **Set Up the Database**
   Execute the SQL scripts in the `sql-migrations` directory to set up your database schema.

5. **Start the Development Server**
   ```bash
   npm run dev
   ```

6. **Set Up the NFC Bridge Server** (if using NFC functionality)
   ```bash
   npm run setup-nfc
   ```

7. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

## User Roles

The U-Pass Manager supports three primary user roles:

### Student (Sam)
- A full-time college student who relies on public transportation
- Can verify eligibility, sign disclaimers, and receive notifications about U-Pass distribution

### Distributor (Dana)
- Responsible for daily U-Pass issuance
- Allocates U-Pass cards via NFC scanning
- Updates student eligibility statuses and ensures students are promptly notified

### Administrator (Alex)
- Has full access rights to manage user roles, view detailed analytics, and export reports
- Ensures student data is consistently updated and manages system configuration

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for information on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt) file for details.

## Support

For support, please contact the U-Pass Manager team at [upass-support@vt.edu](mailto:upass-support@vt.edu).
