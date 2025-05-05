# UPass Manager API Documentation

This document provides comprehensive documentation for the UPass Manager API endpoints, authentication, error handling, and best practices for integration.

## API Overview

The UPass Manager API is a RESTful API that provides programmatic access to the UPass Manager system. The API enables you to:

- Authenticate users and manage sessions
- Search and manage student records
- Check and update eligibility status
- Allocate, replace, and track U-Pass cards
- Generate reports and analytics
- Send and manage notifications
- Import and export data

## Base URL

For production environments:
```
https://api.upassmanager.example.com/api
```

For development/testing:
```
http://localhost:8080/api
```

## Authentication

### Overview

The UPass Manager API uses JSON Web Tokens (JWT) for authentication. To access protected endpoints, you must include a valid token in the `Authorization` header of your requests.

### Login

```
POST /login
```

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123456",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "distributor"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Using the Token

Include the JWT token in the `Authorization` header of subsequent requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiry

Tokens are valid for 24 hours by default. After expiry, you must obtain a new token.

## Student Record APIs

### Search by PID (Student ID)

```
GET /search-by-pid?pid={student_id}
```

Searches for a student record by their PID (Student ID).

**Parameters:**
- `pid` (required): 9-digit student ID number

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "Student_ID": "123456789",
    "First_Name": "Jane",
    "Last_Name": "Smith",
    "Email": "jane.smith@example.com",
    "Active_U_Pass_Card": "01670000001234567893",
    "Replaced_U_Pass_Card": null,
    "Disclaimer_Signed": true,
    "Metro_Acct": "M123456",
    "Distribution_Date": "2025-04-01T10:30:00Z",
    "Picked_Up_By": "Jane Smith",
    "Notes": "Student requested expedited processing",
    "U_Pass_ID": "UVT2025001234"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "No record found for the provided PID"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "PID must be a 9-digit number"
}
```

### Get All Records

```
GET /get-all-records?table={table_name}&limit={limit}&offset={offset}
```

Retrieves all records from a specified table with pagination.

**Parameters:**
- `table` (required): The database table to query (e.g., 'u_pass_manager_current', 'u_pass_manager_fall_2024')
- `limit` (optional): Maximum number of records to return (default: 100)
- `offset` (optional): Number of records to skip (default: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "records": [
    {
      "Student_ID": "123456789",
      "First_Name": "Jane",
      "Last_Name": "Smith",
      "Email": "jane.smith@example.com",
      "Active_U_Pass_Card": "01670000001234567893",
      "Disclaimer_Signed": true,
      "Distribution_Date": "2025-04-01T10:30:00Z"
    },
    {
      "Student_ID": "987654321",
      "First_Name": "John",
      "Last_Name": "Doe",
      "Email": "john.doe@example.com",
      "Active_U_Pass_Card": null,
      "Disclaimer_Signed": false,
      "Distribution_Date": null
    }
  ],
  "total": 2500,
  "limit": 100,
  "offset": 0
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Table name is required"
}
```

### Update Student Record

```
PUT /update-student
```

Updates a student record with new information.

**Request Body:**
```json
{
  "Student_ID": "123456789",
  "Updates": {
    "Email": "jane.updated@example.com",
    "Disclaimer_Signed": true,
    "Notes": "Updated contact information",
    "Metro_Acct": "M789012"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Student record updated successfully",
  "updatedFields": ["Email", "Disclaimer_Signed", "Notes", "Metro_Acct"]
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Student record not found"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Student_ID is required"
}
```

## U-Pass Management APIs

### Allocate U-Pass

```
POST /allocate-upass
```

Allocates a new U-Pass card to a student.

**Request Body:**
```json
{
  "pid": "123456789",
  "upassId": "01670000001234567893"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "U-Pass allocated successfully",
  "isReplacement": false
}
```

**Response (200 OK - Replacement):**
```json
{
  "success": true,
  "message": "U-Pass replaced successfully",
  "isReplacement": true
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Disclaimer must be signed before allocating a U-Pass",
  "disclaimerSigned": false
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "No record found for the provided PID"
}
```

### Update Disclaimer Status

```
PUT /update-disclaimer
```

Updates the disclaimer signed status for a student.

**Request Body:**
```json
{
  "pid": "123456789",
  "signed": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Disclaimer status updated successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "No record found for the provided PID"
}
```

## Data Import/Export APIs

### Upload Student Data

```
POST /upload
```

Uploads a CSV or Excel file containing student data.

**Request:**
- Content-Type: multipart/form-data
- Form field: `file` (CSV or Excel file)
- Form field: `table` (destination table name)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "File processed successfully",
  "recordsProcessed": 150,
  "recordsInserted": 145,
  "recordsUpdated": 5,
  "errors": []
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid file format. Please upload a CSV or Excel file."
}
```

## Notification APIs

### Send Notification

```
POST /send-notification
```

Sends notifications to selected students.

**Request Body:**
```json
{
  "students": ["123456789", "987654321"],
  "subject": "U-Pass Ready for Pickup",
  "message": "Your U-Pass is ready for pickup at the Transportation Office.",
  "templateId": "pickup-notification"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notifications sent successfully",
  "sent": 2,
  "failed": 0,
  "errors": []
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Subject and message are required"
}
```

### Get Message Templates

```
GET /message-templates
```

Retrieves available message templates.

**Response (200 OK):**
```json
{
  "success": true,
  "templates": [
    {
      "id": "pickup-notification",
      "name": "U-Pass Pickup Notification",
      "subject": "Your U-Pass is Ready for Pickup",
      "message": "Dear {{firstName}},\n\nYour U-Pass is now ready for pickup at the Transportation Office...",
      "variables": ["firstName", "lastName", "pickupLocation", "officehours"]
    },
    {
      "id": "replacement-confirmation",
      "name": "Replacement Confirmation",
      "subject": "U-Pass Replacement Confirmed",
      "message": "Dear {{firstName}},\n\nYour request for a U-Pass replacement has been processed...",
      "variables": ["firstName", "lastName", "oldUpassId", "newUpassId"]
    }
  ]
}
```

## Administrator APIs

### Add Distributor

```
POST /add-distributor
```

Adds a new distributor account. Requires administrator privileges.

**Request Body:**
```json
{
  "email": "distributor@example.com",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "location": "Main Campus",
  "sendInvite": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Distributor added successfully",
  "distributorId": "d12345",
  "inviteSent": true
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Administrator privileges required"
}
```

### Get Distributors

```
GET /get-distributors
```

Retrieves a list of all distributors. Requires administrator privileges.

**Response (200 OK):**
```json
{
  "success": true,
  "distributors": [
    {
      "id": "d12345",
      "email": "distributor1@example.com",
      "firstName": "Sarah",
      "lastName": "Johnson",
      "location": "Main Campus",
      "active": true,
      "lastLogin": "2025-04-01T14:30:22Z"
    },
    {
      "id": "d67890",
      "email": "distributor2@example.com",
      "firstName": "Michael",
      "lastName": "Brown",
      "location": "North Campus",
      "active": true,
      "lastLogin": "2025-04-02T09:15:47Z"
    }
  ]
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Administrator privileges required"
}
```

### Remove Distributor

```
DELETE /remove-distributor
```

Removes a distributor account. Requires administrator privileges.

**Request Body:**
```json
{
  "distributorId": "d12345"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Distributor removed successfully"
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Administrator privileges required"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Distributor not found"
}
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request:

- **200 OK**: Request succeeded
- **400 Bad Request**: Invalid input or parameters
- **401 Unauthorized**: Authentication required or failed
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Request conflicts with current state
- **500 Internal Server Error**: Server error

All error responses include a JSON object with:
- `success`: Always `false` for errors
- `message`: A descriptive error message
- `errors`: (optional) Detailed validation errors

Example error response:
```json
{
  "success": false,
  "message": "Invalid input parameters",
  "errors": [
    {
      "field": "pid",
      "message": "PID must be a 9-digit number"
    }
  ]
}
```

## Rate Limiting

To prevent abuse, the API implements rate limiting:

- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated requests

Rate limit information is included in the response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1617302400
```

When a rate limit is exceeded, the API returns a 429 Too Many Requests status code.

## Best Practices

### Authentication

- Store tokens securely
- Implement token refresh before expiry
- Don't expose tokens in URLs or client-side code

### Error Handling

- Implement proper error handling for all API calls
- Display user-friendly error messages
- Log detailed errors for debugging

### Performance

- Use pagination for large data sets
- Limit batch operations to reasonable sizes
- Implement caching for frequently accessed data

### Security

- Use HTTPS for all API calls
- Validate input on both client and server
- Implement proper access controls

## SDK and Examples

For easier integration, we provide SDKs for common programming languages:

- [JavaScript/TypeScript SDK](https://github.com/upassmanager/upass-js-sdk)
- [Python SDK](https://github.com/upassmanager/upass-python-sdk)
- [Java SDK](https://github.com/upassmanager/upass-java-sdk)

Example usage (JavaScript):
```javascript
const UPassAPI = require('upass-js-sdk');

const api = new UPassAPI({
  baseUrl: 'https://api.upassmanager.example.com/api',
  token: 'your-jwt-token'
});

// Search for a student
api.searchByPID('123456789')
  .then(student => {
    console.log('Student found:', student);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });

// Allocate a U-Pass
api.allocateUPass({
  pid: '123456789',
  upassId: '01670000001234567893'
})
  .then(result => {
    console.log('U-Pass allocated:', result);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
```

## Webhooks

The UPass Manager API supports webhooks for real-time event notifications. Available events include:

- `upass.allocated`: When a U-Pass is allocated
- `upass.replaced`: When a U-Pass is replaced
- `student.updated`: When a student record is updated
- `disclaimer.signed`: When a disclaimer is signed

To register a webhook:
```
POST /webhooks/register
```

**Request Body:**
```json
{
  "url": "https://your-server.com/webhook",
  "events": ["upass.allocated", "upass.replaced"],
  "secret": "your-webhook-secret"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "webhookId": "wh12345",
  "events": ["upass.allocated", "upass.replaced"]
}
```

## API Versioning

The API is versioned to ensure compatibility as features evolve. The current version is embedded in the base URL.

We maintain backward compatibility within a major version. Breaking changes will only be introduced in a new major version, with appropriate notice to developers.

## Support

For API support, contact the development team:
- Email: api-support@upassmanager.example.com
- Developer Portal: [https://developers.upassmanager.example.com](https://developers.upassmanager.example.com)
- API Status: [https://status.upassmanager.example.com](https://status.upassmanager.example.com)
