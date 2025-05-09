# UPass Manager

UPass Manager is a comprehensive system developed for Virginia Tech University to streamline the management and distribution of student transit passes. This application enables administrators and distributors to issue UPass cards, track their distribution, manage student data, and provide real-time analytics on usage patterns.

## Features

### UPass Card Management
- Issue and track UPass cards to eligible students
- Process replacements for lost/damaged cards
- Track Metro account linkage
- Record distribution dates and pickup information

### User Management
- Role-based access (Admin and Distributor roles)
- Secure authentication and authorization
- User activity tracking

### Real-time NFC Integration
- Read card data directly using NFC readers
- Streamline student identification and verification
- Update card status in real-time

### Data Visualization
- Dashboard with UPass distribution statistics
- Visual representation of data with charts and graphs
- Data filtering and analysis by semester and time periods

### Notification System
- Send batch notifications to students
- Email notification via AWS SES
- Customizable notification templates

### Export Functionality
- Export data in multiple formats
- Customizable export templates
- Data filtering options

## System Architecture

UPass Manager uses a modern web architecture:

- **Frontend**: Next.js React application with server-side rendering
- **Backend API**: Node.js/Express RESTful API
- **Database**: MySQL database for student and UPass records
- **Authentication**: JWT-based authentication with role-based access control
- **NFC Integration**: Local NFC bridge server for card reading
- **AWS Integration**: 
  - S3 for file storage
  - Lambda for serverless processing
  - SES for email notifications

## Getting Started

### Prerequisites
- Node.js (v16.x or higher)
- npm (v7.x or higher)
- MySQL (v8.x)
- NFC card reader (for card scanning functionality)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd upass-manager
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend API dependencies
   cd backend-api
   npm install
   cd ..
   
   # Install NFC bridge dependencies (optional - only if using NFC functionality)
   cd src/nfc-bridge
   npm install
   cd ../..
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory
   - Create a `.env` file in the `backend-api` directory
   - Add the necessary environment variables following the templates in the respective `.env.example` files

4. Set up the database:
   - Create a MySQL database
   - Update the database connection details in the backend-api/.env file
   - Run the database schema scripts (provided separately)

5. Start the development servers:
   ```bash
   # Start the frontend
   npm run dev
   
   # In a separate terminal, start the backend API
   cd backend-api
   npm start
   
   # If using NFC functionality, start the NFC bridge in another terminal
   cd src/nfc-bridge
   node nfc-server.js
   ```

6. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## Production Deployment

For production deployment instructions, please see the [Deployment Guide](../docs/Deployment.md).

## Documentation

- [User Guide](../wiki/UserManual.pdf) - Instructions for end users
- [API Documentation](../wiki/API.md) - API endpoints and usage
- [System Architecture](../wiki/Architecture.md) - Detailed system architecture
- [NFC Integration](src/nfc-bridge/ARCHITECTURE.md) - NFC bridge documentation

## Contributing

Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.txt](../LICENSE.txt) file for details.

## Acknowledgments

- Virginia Tech Department of Transportation
- The Next.js team
- All contributors to the project

## Contact

For questions or support, please contact the project team at [gettingaround@vt.edu](mailto:gettingaround@vt.edu).
