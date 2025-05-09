# UPass Manager System Architecture

This document provides a comprehensive overview of the UPass Manager system architecture, including components, data flow, technology stack, and deployment considerations.

## High-Level Architecture

The UPass Manager system follows a modern cloud-based architecture with the following key components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Client Layer   │────▶│  Service Layer  │────▶│   Data Layer    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Client Layer
The client layer consists of the frontend applications that users interact with:
- Web application built with Next.js and React
- Responsive design for mobile and desktop using TailwindCSS
- Role-specific interfaces for students, distributors, and administrators

### Service Layer
The service layer manages business logic and processes requests:
- RESTful API endpoints implemented via Next.js API routes
- Authentication and authorization services
- NFC bridge service for card reading
- Notification service for email communications
- Reporting and analytics services

### Data Layer
The data layer handles data storage and retrieval:
- MySQL database for structured data storage
- AWS S3 for file storage (CSV imports/exports, reports)
- Redis cache for performance optimization (optional)

## Technology Stack

### Frontend
- **Framework**: Next.js 15.x
- **UI Library**: React 19.x
- **Styling**: TailwindCSS 4.x
- **State Management**: React Context API
- **Charts**: Chart.js for data visualization
- **Form Handling**: React Hook Form
- **Language**: JavaScript/TypeScript

### Backend
- **API Framework**: Next.js API Routes
- **Authentication**: JWT-based authentication
- **Database Access**: MySQL with custom ORM layer
- **Validation**: Joi/Zod for input validation
- **AWS Integration**: AWS SDK for JavaScript

### Infrastructure
- **Database**: MySQL (RDS)
- **File Storage**: Amazon S3
- **Email Service**: Amazon SES
- **Hosting**: Vercel (Next.js) / EC2 / ECS
- **CI/CD**: GitHub Actions
- **Monitoring**: CloudWatch or custom monitoring solution

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Applications                       │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │             │    │             │    │                     │  │
│  │  Web App    │    │ Dashboard   │    │ Admin Portal        │  │
│  │             │    │             │    │                     │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                             API Layer                            │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Service Components                        │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │             │    │             │    │                     │  │
│  │ Auth Service│    │ U-Pass      │    │ Notification        │  │
│  │             │    │ Service     │    │ Service             │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │             │    │             │    │                     │  │
│  │ User Service│    │ Reporting   │    │ NFC Bridge          │  │
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
│  │  MySQL DB   │    │ AWS S3      │    │ Redis Cache         │  │
│  │             │    │             │    │ (Optional)          │  │
│  └─────────────┘    └─────────────┘    └─────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Application Components

### Frontend Components

1. **Authentication Module**
   - Login/logout functionality
   - Session management
   - Password recovery
   - Role-based UI rendering

2. **Dashboard Views**
   - Student search and management
   - U-Pass allocation interface
   - Real-time NFC card reading
   - Data visualization and charts

3. **Admin Portal**
   - User management
   - System configuration
   - Data import/export tools
   - Report generation

4. **Shared Components**
   - Header/footer
   - Navigation menu
   - Modal dialogs
   - Form components
   - Notification components

### Backend Services

1. **Authentication Service**
   - User authentication
   - Token generation and validation
   - Role-based access control

2. **U-Pass Management Service**
   - Student record management
   - U-Pass allocation and tracking
   - Disclaimer management
   - Eligibility verification

3. **Notification Service**
   - Email template management
   - Batch notification sending
   - Notification history tracking

4. **Reporting Service**
   - Generate statistical reports
   - Data aggregation and analysis
   - Export to various formats

5. **NFC Bridge Service**
   - Local service for card reading
   - WebSocket communication
   - Card data formatting and validation

## Data Flow

### 1. User Authentication Flow

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│         │     │             │     │             │     │             │
│  User   │────▶│  Frontend   │────▶│  Auth API   │────▶│  Database   │
│         │     │             │     │             │     │             │
└─────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                      │                    │
                      │                    │
                      ▼                    ▼
                ┌─────────────┐     ┌─────────────┐
                │             │     │             │
                │  JWT Token  │◀────│  Session    │
                │             │     │  Storage    │
                └─────────────┘     └─────────────┘
```

1. User submits credentials via the login form
2. Frontend sends credentials to Auth API endpoint
3. Auth API validates credentials against database
4. If valid, JWT token is generated and returned
5. Frontend stores token for subsequent requests
6. User is redirected to appropriate dashboard

### 2. Student Data Ingestion Flow

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│         │     │             │     │             │     │             │
│  Admin  │────▶│  Upload UI  │────▶│  Import API │────▶│  Validation │
│         │     │             │     │             │     │  Service    │
└─────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                               │
                                                               │
                                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  DB Update  │◀────│  Transform  │◀────│  Error      │◀────│  Data       │
│  Service    │     │  Service    │     │  Handling   │     │  Mapping    │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

1. Administrator uploads student data CSV/Excel file
2. Import API processes the file and validates format
3. Data mapping service maps columns to database fields
4. Validation service checks data integrity and eligibility rules
5. Error handling identifies and reports issues
6. Transform service prepares data for database insertion
7. Database update service inserts/updates records

### 3. U-Pass Distribution Flow

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│         │     │             │     │             │     │             │
│Distributor────▶│  Search UI  │────▶│  Search API │────▶│  Database   │
│         │     │             │     │             │     │  Query      │
└─────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                               │
                                                               │
                                                               ▼
┌─────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│         │     │             │     │             │     │             │
│  NFC    │────▶│  NFCModal   │────▶│  Allocate   │────▶│  Database   │
│  Reader │     │  Component  │     │  API        │     │  Update     │
│         │     │             │     │             │     │             │
└─────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                               │
                                                               │
                                                               ▼
                                                        ┌─────────────┐
                                                        │             │
                                                        │Notification │
                                                        │  Service    │
                                                        │             │
                                                        └─────────────┘
```

1. Distributor searches for student by ID or name
2. Search API queries database and returns student record
3. Distributor verifies eligibility and confirms identity
4. Distributor scans U-Pass card with NFC reader
5. NFC Bridge sends card data to NFCModal component
6. Distributor confirms allocation
7. Allocate API updates database with U-Pass information
8. Notification service sends confirmation email to student

### 4. Reporting and Analytics Flow

```
┌─────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│         │     │             │     │             │     │             │
│  Admin  │────▶│  Report UI  │────▶│  Report API │────▶│  Data       │
│         │     │             │     │             │     │  Query      │
└─────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                               │
                                                               │
                                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │
│  Download   │◀────│  Export     │◀────│  Format     │◀────│  Aggregate  │
│  File       │     │  Service    │     │  Service    │     │  Service    │
│             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

1. Administrator selects report type and parameters
2. Report API processes request and queries data
3. Aggregate service performs data aggregation and calculations
4. Format service prepares data for desired output format
5. Export service generates file (CSV, Excel, PDF)
6. File is returned to the user for download

## Database Schema

The UPass Manager uses a relational database with the following schema:

### Users
- `id`: BIGINT PRIMARY KEY
- `email`: VARCHAR(255) UNIQUE
- `password_hash`: VARCHAR(255)
- `first_name`: VARCHAR(100)
- `last_name`: VARCHAR(100)
- `role`: ENUM('admin', 'distributor', 'student')
- `active`: BOOLEAN
- `last_login`: DATETIME
- `created_at`: DATETIME
- `updated_at`: DATETIME

### Distributors
- `id`: BIGINT PRIMARY KEY
- `user_id`: BIGINT FOREIGN KEY
- `location`: VARCHAR(255)
- `active`: BOOLEAN
- `created_at`: DATETIME
- `updated_at`: DATETIME

### Students (U-Pass Manager Current)
- `Student_ID`: VARCHAR(9) PRIMARY KEY
- `First_Name`: VARCHAR(100)
- `Last_Name`: VARCHAR(100)
- `Email`: VARCHAR(255)
- `Active_U_Pass_Card`: VARCHAR(20)
- `Replaced_U_Pass_Card`: VARCHAR(20)
- `Disclaimer_Signed`: BOOLEAN
- `Metro_Acct`: VARCHAR(100)
- `Distribution_Date`: DATETIME
- `Picked_Up_By`: VARCHAR(255)
- `Notes`: TEXT
- `U_Pass_ID`: VARCHAR(100)
- `created_at`: DATETIME
- `updated_at`: DATETIME

### U-Pass Cards
- `id`: BIGINT PRIMARY KEY
- `card_number`: VARCHAR(20) UNIQUE
- `status`: ENUM('active', 'inactive', 'lost', 'replaced')
- `assigned_to`: VARCHAR(9) FOREIGN KEY
- `assigned_by`: BIGINT FOREIGN KEY
- `assigned_at`: DATETIME
- `created_at`: DATETIME
- `updated_at`: DATETIME

### Notifications
- `id`: BIGINT PRIMARY KEY
- `student_id`: VARCHAR(9) FOREIGN KEY
- `subject`: VARCHAR(255)
- `message`: TEXT
- `sent_at`: DATETIME
- `status`: ENUM('sent', 'delivered', 'failed')
- `created_at`: DATETIME

### Audit Logs
- `id`: BIGINT PRIMARY KEY
- `user_id`: BIGINT FOREIGN KEY
- `action`: VARCHAR(255)
- `entity_type`: VARCHAR(50)
- `entity_id`: VARCHAR(50)
- `details`: JSON
- `ip_address`: VARCHAR(45)
- `user_agent`: VARCHAR(255)
- `created_at`: DATETIME

## Security Architecture

### Authentication and Authorization

1. **JWT-based Authentication**
   - Tokens issued upon successful login
   - Short expiration time (24 hours)
   - Secure, HttpOnly cookies for token storage
   - Token validation on every API request

2. **Role-Based Access Control**
   - Predefined roles: Admin, Distributor, Student
   - Permission validation middleware
   - UI elements conditionally rendered based on role
   - API endpoints protected by role-based authorization

### Data Security

1. **Data Encryption**
   - HTTPS/TLS for all communications
   - Data encrypted at rest (database)
   - Sensitive data encrypted with strong algorithms
   - PID masking for student IDs in UI

2. **Input Validation**
   - Server-side validation of all inputs
   - Parameterized queries to prevent SQL injection
   - Input sanitization to prevent XSS attacks
   - Request rate limiting to prevent abuse

### Audit and Compliance

1. **Comprehensive Logging**
   - Authentication events
   - User actions
   - System events
   - Error conditions

2. **Data Retention Policies**
   - Automated data archiving
   - Compliance with privacy regulations
   - Data purging schedules

## Deployment Architecture

### Development Environment

```
┌────────────────────────────────────────────────────────────┐
│                    Developer Workstation                   │
│                                                            │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────┐   │
│  │             │   │             │   │                 │   │
│  │  Next.js    │   │  Local DB   │   │  NFC Bridge    │   │
│  │  Dev Server │   │  (MySQL)    │   │  Local Server  │   │
│  │             │   │             │   │                 │   │
│  └─────────────┘   └─────────────┘   └─────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Production Environment

```
┌────────────────────────────────────────────────────────────┐
│                         AWS Cloud                          │
│                                                            │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────┐   │
│  │             │   │             │   │                 │   │
│  │  Vercel/EC2 │   │  RDS        │   │  S3 Buckets    │   │
│  │  Frontend   │   │  Database   │   │                │   │
│  │             │   │             │   │                 │   │
│  └─────────────┘   └─────────────┘   └─────────────────┘   │
│                                                            │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────────┐   │
│  │             │   │             │   │                 │   │
│  │  Lambda     │   │  SES        │   │  CloudWatch    │   │
│  │  Functions  │   │  Email      │   │  Monitoring    │   │
│  │             │   │             │   │                 │   │
│  └─────────────┘   └─────────────┘   └─────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                    Client Workstation                      │
│                                                            │
│  ┌─────────────┐   ┌─────────────┐                         │
│  │             │   │             │                         │
│  │  Web        │   │  NFC Bridge │                         │
│  │  Browser    │   │  Local Svc  │                         │
│  │             │   │             │                         │
│  └─────────────┘   └─────────────┘                         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Scalability and Performance

### Horizontal Scaling

The system is designed to scale horizontally:
- Stateless API services can be deployed across multiple instances
- Load balancing distributes traffic
- Database connection pooling for efficient resource utilization

### Performance Optimization

1. **Client-Side**
   - Code splitting for faster initial load
   - Static generation for public pages
   - Client-side caching of static assets
   - Optimized images and resources

2. **Server-Side**
   - API response caching
   - Database query optimization
   - Connection pooling
   - Pagination for large data sets

3. **Database**
   - Proper indexing strategy
   - Query optimization
   - Periodic maintenance
   - Table partitioning for large tables

## Monitoring and Observability

### System Monitoring

1. **Application Metrics**
   - Request rates and latencies
   - Error rates and types
   - User activity patterns
   - Resource utilization

2. **Infrastructure Monitoring**
   - Server health
   - Database performance
   - Network metrics
   - Storage utilization

### Logging Strategy

1. **Application Logs**
   - Structured JSON logging
   - Log levels (DEBUG, INFO, WARN, ERROR)
   - Contextual information (user, action, timestamp)
   - Correlation IDs for request tracing

2. **Log Management**
   - Centralized log collection
   - Log retention policies
   - Log search and analysis
   - Alerting on log patterns

## Disaster Recovery

### Backup Strategy

1. **Database Backups**
   - Daily full backups
   - Hourly incremental backups
   - Point-in-time recovery capability
   - Backup verification process

2. **Configuration Backups**
   - Infrastructure as Code (IaC)
   - Version-controlled configurations
   - Environment configuration backups

### Recovery Procedures

1. **Database Recovery**
   - RDS automated failover
   - Restore from backup procedure
   - Data validation post-recovery

2. **Application Recovery**
   - Deployment rollback capability
   - Blue-green deployment strategy
   - Service health checks and auto-recovery

## Future Architecture Considerations

1. **Microservices Evolution**
   - Further decomposition into specialized services
   - Service mesh for inter-service communication
   - API gateway for external access

2. **Advanced Analytics**
   - Data warehouse integration
   - Business intelligence dashboards
   - Predictive analytics for usage patterns

3. **Mobile Application**
   - Native mobile app for distributors
   - Offline mode for distribution
   - Mobile-specific optimization

4. **Integration Enhancements**
   - Expanded API for university systems integration
   - Real-time sync with transportation systems
   - Advanced event-driven architecture

## Appendix: Environment Configuration

### Development Environment

Required software:
- Node.js 18.x or higher
- MySQL 8.x
- Git
- NFC card reader with PC/SC driver

Environment variables:
```
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=upass_dev
DB_PASSWORD=your_password
DB_NAME=upass_manager

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# NFC Bridge
NFC_BRIDGE_PORT=3001

# Application
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000/api
```

### Production Environment

Required AWS services:
- EC2 or Vercel for hosting
- RDS for MySQL database
- S3 for file storage
- Lambda for serverless functions
- SES for email notifications
- CloudWatch for monitoring

Environment variables:
```
# Database
DB_HOST=your-rds-instance.region.rds.amazonaws.com
DB_PORT=3306
DB_USER=upass_prod
DB_PASSWORD=your_secure_password
DB_NAME=upass_manager

# Authentication
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=24h

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET=upass-manager-files
SES_FROM_EMAIL=noreply@upassmanager.example.com

# Application
NODE_ENV=production
PORT=3000
API_URL=https://api.upassmanager.example.com
```
