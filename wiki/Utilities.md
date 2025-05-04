# AWS Lambda and Utility Functions Documentation

This document provides detailed documentation for the AWS Lambda functions and utility modules used in the UPass Manager system.

## Table of Contents

1. [Lambda Functions](#lambda-functions)
2. [Authentication Utilities](#authentication-utilities)
3. [Database Utilities](#database-utilities)
4. [Helper Functions](#helper-functions)

## Lambda Functions

### Lambda Handler

**File Path:** `/src/cloud/lambda-code/lambda_handler.mjs`

**Purpose:** AWS Lambda function handler that processes data and sends notifications through AWS SES.

**Key Functionality:**
- Receives event data from API Gateway or other AWS services
- Processes student eligibility data
- Sends email notifications using AWS SES
- Returns processing results to the caller

**Invocation:**
This Lambda function can be invoked by:
1. API Gateway endpoints
2. Scheduled CloudWatch Events
3. Direct invocation from application code using AWS SDK

**Configuration:**
The Lambda function requires the following environment variables:
- `AWS_REGION`: AWS region for SES service
- `EMAIL_FROM`: Sender email address for notifications
- `EMAIL_SUBJECT_PREFIX`: Prefix for email subject lines

**Input Example:**
```json
{
  "action": "sendNotification",
  "data": {
    "to": "student@vt.edu",
    "subject": "U-Pass Allocation",
    "message": "Your U-Pass has been allocated successfully"
  }
}
```

**Output Example:**
```json
{
  "statusCode": 200,
  "body": {
    "message": "Email sent successfully",
    "messageId": "0102018abc-123a-4567-89bc-def0123456789-000000"
  }
}
```

## Authentication Utilities

### Auth Module

**File Path:** `/upass-manager/backend-common/auth.js`

**Purpose:** Provides authentication and authorization functionality for the application.

**Key Features:**
- JWT token generation and verification
- Role-based access control
- Password hashing and verification
- Authentication middleware for API routes

**Main Functions:**

#### `generateToken(user)`
Generates a JWT token for authenticated users.

**Parameters:**
- `user`: Object containing user information (id, email, role)

**Returns:**
- String containing the JWT token

**Example:**
```javascript
const token = generateToken({
  id: 123,
  email: 'distributor@vt.edu',
  role: 'distributor'
});
```

#### `verifyToken(token)`
Verifies a JWT token and extracts the user information.

**Parameters:**
- `token`: String containing the JWT token to verify

**Returns:**
- Object containing the decoded user information or null if invalid

**Example:**
```javascript
const user = verifyToken(token);
if (user) {
  console.log(`Authenticated as ${user.email}`);
}
```

#### `requireAuth(handler)`
Middleware function that ensures a route requires authentication.

**Parameters:**
- `handler`: The API route handler function to wrap

**Returns:**
- A new handler function that checks for authentication before calling the original handler

**Example:**
```javascript
// In an API route file
import { requireAuth } from '../../backend-common/auth';

const protectedHandler = (req, res) => {
  // Protected route logic
};

export default requireAuth(protectedHandler);
```

## Database Utilities

### Database Connection Module

**File Path:** `/upass-manager/backend-api/db.js`

**Purpose:** Establishes and manages database connections for the application.

**Key Features:**
- MySQL connection pool management
- Query execution with parameterized statements
- Error handling and connection retry logic

**Main Functions:**

#### `executeQuery(query, params)`
Executes a SQL query with parameterized values.

**Parameters:**
- `query`: String containing the SQL query with placeholders
- `params`: Array of parameter values to bind to the query

**Returns:**
- Promise that resolves to the query results

**Example:**
```javascript
const students = await executeQuery(
  'SELECT * FROM students WHERE status = ?',
  ['active']
);
```

## Helper Functions

### PID Masking Utility

**File Path:** `/src/app/utils/maskPid.js`

**Purpose:** Masks sensitive PID (Student ID) information for display.

**Main Function:**

#### `maskPid(pid)`
Masks a student PID to show only the last 4 digits.

**Parameters:**
- `pid`: String containing the full 9-digit PID

**Returns:**
- String with masked PID (e.g., "*****6789")

**Example:**
```javascript
import { maskPid } from '../utils/maskPid';

const displayPid = maskPid('123456789'); // Returns "*****6789"
```

### User Controller

**File Path:** `/src/app/controllers/UserController.js`

**Purpose:** Handles user-related business logic and data operations.

**Key Functions:**

#### `authenticateUser(username, password)`
Authenticates a user with the provided credentials.

**Parameters:**
- `username`: String containing the user's email or username
- `password`: String containing the user's password

**Returns:**
- Promise that resolves to an object with user data and token if successful

**Example:**
```javascript
import { authenticateUser } from '../controllers/UserController';

async function handleLogin(credentials) {
  try {
    const result = await authenticateUser(
      credentials.username,
      credentials.password
    );
    
    if (result.token) {
      // Login successful
      localStorage.setItem('token', result.token);
      localStorage.setItem('userRole', result.userRole);
    }
  } catch (error) {
    // Handle authentication error
  }
}
```

### User Model

**File Path:** `/src/app/models/UserModel.js`

**Purpose:** Defines the user data structure and database interactions.

**Key Methods:**

#### `getUserByEmail(email)`
Retrieves a user record by email address.

**Parameters:**
- `email`: String containing the user's email address

**Returns:**
- Promise that resolves to the user object if found

**Example:**
```javascript
import { getUserByEmail } from '../models/UserModel';

async function checkUserExists(email) {
  const user = await getUserByEmail(email);
  return !!user;
}
```