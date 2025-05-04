# System Architecture

This document outlines the architecture of the UPassManager system, including its components, data flow, and technology stack.

## High-Level Architecture

The UPassManager system follows a modern cloud-based architecture with the following key components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Client Layer   │────▶│  Service Layer  │────▶│   Data Layer    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 15.3.1
- **UI Library**: React 19.0.0
- **Styling**: TailwindCSS 4.0.12
- **Language**: TypeScript 5

### Backend
- **API Framework**: Next.js API Routes
- **Authentication**: JWT-based authentication (jsonwebtoken 9.0.2)
- **Database**: MySQL (mysql2 3.14.0)
- **Cloud Functions**: AWS Lambda (@aws-sdk/client-lambda 3.540.0)
- **Email Service**: AWS SES (@aws-sdk/client-ses 3.782.0)

### Infrastructure
- **Cloud Provider**: AWS
- **Storage**: AWS S3 (implied by AWS SDK usage)
- **Environment Variables**: dotenv 16.4.5

## Project Structure

The UPassManager codebase is organized into several directories:

### `/upass-manager`
Main project directory containing the Next.js application.

### `/upass-manager/backend-api`
Contains backend API implementation for the application endpoints.

### `/upass-manager/backend-common`
Shared utilities and modules used across the backend.

### `/upass-manager/pages/api`
API route handlers that expose the backend functionality.

### `/upass-manager/src/app`
Frontend application code including components, controllers, models, and pages.

### `/upass-manager/src/cloud`
AWS Lambda functions code for serverless operations.

### `/upass-manager/sql-migrations`
SQL scripts for database schema migrations.

### `/wiki`
Project documentation including architecture, API reference, and user guides.

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Applications                       │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │             │    │             │    │                     │  │
│  │  Web App    │    │ Mobile App  │    │ Admin Dashboard     │  │
│  │             │    │             │    │                     │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                           API Gateway                            │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Microservices Layer                       │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │             │    │             │    │                     │  │
│  │ Auth Service│    │ U-Pass      │    │ Notification        │  │
│  │             │    │ Service     │    │ Service             │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │             │    │             │    │                     │  │
│  │ User Service│    │ Analytics   │    │ Eligibility         │  │
│  │             │    │ Service     │    │ Service             │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                           Data Layer                             │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │             │    │             │    │                     │  │
│  │  Database   │    │ File Storage│    │ Cache               │  │
│  │             │    │             │    │                     │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **Student Data Ingestion**
   - Student data is ingested from university systems
   - Data is validated and stored in the database
   - Eligibility is determined based on predefined rules

2. **U-Pass Distribution**
   - Distributor logs into the system
   - System verifies student eligibility
   - Distributor scans NFC/QR code to allocate U-Pass
   - System updates student record and sends notification

3. **Analytics and Reporting**
   - System collects usage data
   - Administrators can view dashboards and generate reports
   - Data can be exported for external reporting

## Database Schema

### Users Table
- `id`: Unique identifier
- `email`: User email
- `password`: Hashed password
- `role`: User role (student, distributor, admin)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Students Table
- `id`: Unique identifier
- `user_id`: Foreign key to Users table
- `student_id`: University student ID
- `first_name`: First name
- `last_name`: Last name
- `eligibility_status`: Current eligibility status
- `created_at`: Timestamp
- `updated_at`: Timestamp

### UPasses Table
- `id`: Unique identifier
- `student_id`: Foreign key to Students table
- `pass_number`: U-Pass card number
- `issue_date`: Date issued
- `expiry_date`: Date of expiry
- `status`: Current status (active, inactive, lost)
- `distributor_id`: Foreign key to Users table (distributor who issued)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Notifications Table
- `id`: Unique identifier
- `student_id`: Foreign key to Students table
- `type`: Notification type
- `message`: Notification message
- `read`: Boolean indicating if read
- `created_at`: Timestamp

## Security Architecture

- **Authentication**: JWT-based authentication with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Encryption**: Data encrypted at rest and in transit
- **API Security**: Rate limiting, input validation, CORS
- **Audit Logging**: Comprehensive logging of all system actions

## Scalability Considerations

- Horizontal scaling of services
- Database sharding for large datasets
- Caching layer for frequently accessed data
- CDN for static assets
- Auto-scaling based on load

## Monitoring and Alerting

- Real-time monitoring of system health
- Automated alerts for system issues
- Performance metrics collection
- Error tracking and reporting

## API Endpoints

The UPassManager system exposes the following key API endpoints:

### Authentication
- `/api/login` - Authenticates users and issues JWT tokens

### U-Pass Management
- `/api/search-by-pid` - Searches for student records by PID
- `/api/allocate-upass` - Allocates U-Pass to eligible students
- `/api/get-all-records` - Retrieves all U-Pass records

### Distributor Management
- `/api/get-distributors` - Gets list of all distributors
- `/api/remove-distributor` - Removes a distributor

### Notifications
- `/api/send-notification` - Sends notifications to students
- `/api/message-templates` - Manages notification message templates

### System Management
- `/api/update-disclaimer` - Updates system disclaimer text
- `/api/upload` - Uploads data to the system

## File Upload and Processing

1. Users upload files through the UploadModal component
2. Files are processed by the `/api/upload` endpoint
3. Data is validated and stored in the database
4. AWS Lambda functions may be triggered for additional processing

## Authentication Flow

1. Users enter credentials on the Login page
2. Credentials are validated by the `/api/login` endpoint
3. JWT token is issued and stored in localStorage
4. Token is included in subsequent API requests
5. User role determines available functionality

## NFC Integration

The system includes NFC functionality for physical U-Pass allocation:
1. Distributor initiates allocation via the NFCModal component
2. System verifies student eligibility
3. NFC reader associates physical card with student record
4. Database is updated with the allocation information
