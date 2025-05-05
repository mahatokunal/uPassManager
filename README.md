# UPass Manager

## Project Overview
UPass Manager is a comprehensive system developed for Virginia Tech University to streamline the management of student transit passes. This application allows administrators to issue UPass cards, track their distribution, manage student data, and provide real-time analytics on usage patterns.

## System Architecture
The UPass Manager uses a modern microservices architecture:

- **Frontend**: Next.js React application with server-side rendering
- **Backend API**: Node.js REST API endpoints
- **Database**: MySQL RDS database for student and UPass records
- **Authentication**: JWT-based authentication system with role-based access control
- **AWS Integration**: 
  - S3 for file storage
  - Lambda for serverless processing of data and notifications
  - SES for email notifications

![Architecture Diagram](docs/images/architecture-diagram.png)

## Key Features

### UPass Management
- Issue and track UPass cards to students
- Process replacements for lost/damaged cards
- Track Metro account linkage
- Record distribution dates and pickup information

### User Management
- Role-based access (Admin and Distributor roles)
- Secure authentication and authorization
- User activity tracking

### Data Visualization
- Real-time dashboard with UPass distribution statistics
- Visual representation of data with charts and graphs
- Exportable reports for administrative purposes

### NFC Integration
- Read card data directly using NFC readers
- Streamline student identification and verification
- Update card status in real-time

### Notification System
- Send batch notifications to students
- Custom notification templates
- Email notification tracking

### Export Functionality
- Export data in multiple formats (Excel, CSV)
- Customizable export templates
- Data filtering options

## Technology Stack

### Frontend
- **Next.js**: React framework with server-side rendering
- **Tailwind CSS**: Utility-first CSS framework
- **React Context API**: State management
- **Chart.js**: Data visualization

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MySQL**: Relational database
- **AWS SDK**: Integration with AWS services

### Cloud Services
- **AWS Lambda**: Serverless computing
- **Amazon RDS**: Managed relational database service
- **Amazon S3**: Object storage service
- **Amazon SES**: Email service

### Development Tools
- **Git**: Version control
- **ESLint**: Code linting
- **Jest**: Testing framework

## Installation and Setup

### Prerequisites
- Node.js (v16.x or higher)
- npm (v7.x or higher)
- MySQL (v8.x)
- AWS account with configured services

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/virginia-tech/upass-manager.git
   cd upass-manager
   ```

2. Install dependencies:
   ```bash
   # Install main project dependencies
   npm install
   
   # Install backend API dependencies
   cd upass-manager/backend-api
   npm install
   
   # Install NFC bridge dependencies
   cd ../src/nfc-bridge
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Create a `.env` file in the `backend-api` directory
   - Add the necessary environment variables (see `.env.example` files)

4. Start the development servers:
   ```bash
   # Start the Next.js frontend
   npm run dev
   
   # In another terminal, start the backend API
   cd backend-api
   npm start
   
   # If using NFC functionality, start the NFC bridge
   cd ../src/nfc-bridge
   node nfc-server.js
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

### Production Deployment

For production deployment, see the [Deployment Guide](docs/Deployment.md).

## User Roles

### Administrator
- Full access to all system features
- Manage distributors and system settings
- View all analytics and reports
- Configure notification templates
- Import and export all data

### Distributor
- Issue UPass cards to students
- Update student information
- View basic analytics
- Send notifications to students
- Limited export capabilities

## Contributing
Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.

## Acknowledgments
- Virginia Tech Department of Transportation
- The Next.js team
- All contributors to the project

## Contact
For any questions or support, please contact the project team at [gettingaround@vt.edu](mailto:gettingaround@vt.edu).
