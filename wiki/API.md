# API Documentation

## Overview
The UPass Manager API provides programmatic access to U-Pass data, student records, and system functions. This documentation describes available endpoints, request/response formats, and authentication requirements.

## Base URL
All API endpoints are relative to:
```
https://your-domain.com/api
```

For local development:
```
http://localhost:3000/api
```

## Authentication
Most API endpoints require authentication. Include the user role in the `Authorization` header of your requests.

```
Authorization: admin
```

or

```
Authorization: distributor
```

## API Endpoints

### Student Data

#### Search Student by PID

```
GET /search-by-pid?pid={pid}
```

Retrieves student information by their PID (9-digit Virginia Tech ID number).

**Parameters:**
- `pid` (required): 9-digit PID number

**Response:**
```json
{
  "data": {
    "Student_ID": "123456789",
    "First_Name": "John",
    "Last_Name": "Doe",
    "Email": "johndoe@vt.edu",
    "Active_U_Pass_Card": "12345678901234567890",
    "Replaced_U_Pass_Card": null,
    "Disclaimer_Signed": 1,
    "Metro_Acct": null,
    "Distribution_Date": "2025-03-15",
    "Picked_Up_By": "John Doe",
    "Notes": "Student requested card on 3/10",
    "U_Pass_ID": null
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid PID format
- `404 Not Found`: No student found with the provided PID
- `500 Internal Server Error`: Server error

---

#### Get All Records

```
GET /get-all-records
```

Retrieves a paginated list of student records with optional filtering.

**Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of records per page (default: 10)
- `table` (optional): Database table to query (default: 'u_pass_manager_current')
- Filter parameters (optional): Any column name can be used as a filter

**Response:**
```json
{
  "records": [
    {
      "Student_ID": "123456789",
      "First_Name": "John",
      "Last_Name": "Doe",
      "Email": "johndoe@vt.edu",
      "Active_U_Pass_Card": "12345678901234567890",
      "Replaced_U_Pass_Card": null,
      "Disclaimer_Signed": 1,
      "Metro_Acct": null,
      "Distribution_Date": "2025-03-15",
      "Picked_Up_By": "John Doe",
      "Notes": "Student requested card on 3/10",
      "U_Pass_ID": null
    },
    // Additional records...
  ],
  "pagination": {
    "totalRecords": 156,
    "totalPages": 16,
    "currentPage": 1,
    "limit": 10
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid parameters
- `500 Internal Server Error`: Server error

---

### U-Pass Management

#### Allocate U-Pass

```
POST /allocate-upass
```

Allocates a U-Pass card to a student.

**Request Body:**
```json
{
  "pid": "123456789",
  "upassId": "12345678901234567890"
}
```

**Response:**
```json
{
  "message": "U-Pass allocated successfully",
  "success": true,
  "isReplacement": false
}
```

**Error Responses:**
- `400 Bad Request`: Invalid parameters or disclaimer not signed
- `404 Not Found`: Student not found
- `500 Internal Server Error`: Server error

---

#### Update Disclaimer

```
POST /update-disclaimer
```

Updates the disclaimer signed status for a student.

**Request Body:**
```json
{
  "pid": "123456789"
}
```

**Response:**
```json
{
  "message": "Disclaimer signed status updated successfully",
  "success": true
}
```

**Error Responses:**
- `400 Bad Request`: Invalid PID
- `404 Not Found`: Student not found
- `500 Internal Server Error`: Server error

---

#### Update Student Record

```
POST /update-student
```

Updates student information in the database.

**Request Body:**
```json
{
  "Student_ID": "123456789",
  "Active_U_Pass_Card": "12345678901234567890",
  "Replaced_U_Pass_Card": "09876543210987654321",
  "Disclaimer_Signed": 1,
  "Metro_Acct": "M12345",
  "Distribution_Date": "2025-03-15",
  "Picked_Up_By": "John Doe",
  "Notes": "Card replaced due to damage",
  "U_Pass_ID": "UP12345"
}
```

**Response:**
```json
{
  "message": "Student record updated successfully",
  "success": true
}
```

**Error Responses:**
- `400 Bad Request`: Invalid parameters
- `404 Not Found`: Student not found
- `500 Internal Server Error`: Server error

---

### Notification System

#### Get Message Templates

```
GET /message-templates
```

Retrieves available notification message templates.

**Response:**
```json
{
  "templates": [
    {
      "id": 1,
      "name": "U-Pass Ready for Pickup",
      "subject": "Your U-Pass is Ready for Pickup",
      "body": "Dear {{FIRST_NAME}},\n\nYour U-Pass is now ready for pickup...",
      "created_at": "2025-01-15T12:00:00Z",
      "updated_at": "2025-01-15T12:00:00Z"
    },
    // Additional templates...
  ]
}
```

**Error Responses:**
- `500 Internal Server Error`: Server error

---

#### Send Notification

```
POST /send-notification
```

Sends notifications to selected students.

**Request Body:**
```json
{
  "templateId": 1,
  "customSubject": "Your U-Pass is Ready",
  "customBody": "Dear {{FIRST_NAME}},\n\nYour U-Pass is now ready...",
  "recipients": ["student1@vt.edu", "student2@vt.edu"]
}
```

**Response:**
```json
{
  "message": "Notifications sent successfully",
  "success": true,
  "sentCount": 2
}
```

**Error Responses:**
- `400 Bad Request`: Invalid parameters
- `500 Internal Server Error`: Server error

---

### User Management

#### Login

```
POST /login
```

Authenticates a user and returns their role.

**Request Body:**
```json
{
  "email": "distributor@vt.edu",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "role": "distributor"
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

---

#### Add Distributor

```
POST /add-distributor
```

Adds a new distributor user (admin only).

**Request Body:**
```json
{
  "email": "newdistributor@vt.edu",
  "firstName": "Jane",
  "lastName": "Smith",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Distributor added successfully",
  "success": true
}
```

**Error Responses:**
- `400 Bad Request`: Invalid parameters
- `401 Unauthorized`: Not authorized as admin
- `409 Conflict`: User already exists
- `500 Internal Server Error`: Server error

---

#### Get Distributors

```
GET /get-distributors
```

Retrieves a list of distributors (admin only).

**Response:**
```json
{
  "distributors": [
    {
      "id": 1,
      "email": "distributor1@vt.edu",
      "first_name": "John",
      "last_name": "Doe",
      "created_at": "2025-01-15T12:00:00Z"
    },
    // Additional distributors...
  ]
}
```

**Error Responses:**
- `401 Unauthorized`: Not authorized as admin
- `500 Internal Server Error`: Server error

---

#### Remove Distributor

```
POST /remove-distributor
```

Removes a distributor from the system (admin only).

**Request Body:**
```json
{
  "email": "distributor@vt.edu"
}
```

**Response:**
```json
{
  "message": "Distributor removed successfully",
  "success": true
}
```

**Error Responses:**
- `400 Bad Request`: Invalid email
- `401 Unauthorized`: Not authorized as admin
- `404 Not Found`: Distributor not found
- `500 Internal Server Error`: Server error

---

### Data Import

#### Upload Students Data

```
POST /upload
```

Uploads student data from a CSV or Excel file.

**Request Body:**
Form data with a file named "file"

**Response:**
```json
{
  "message": "File uploaded and processed successfully",
  "recordsProcessed": 150,
  "recordsAdded": 25,
  "recordsUpdated": 125
}
```

**Error Responses:**
- `400 Bad Request`: Invalid file format or missing file
- `401 Unauthorized`: Not authorized as admin
- `500 Internal Server Error`: Server error

## Error Handling

All API endpoints return errors in a consistent format:

```json
{
  "message": "Detailed error message",
  "error": "Optional error type or code"
}
```

## Rate Limiting

API requests are limited to 100 requests per minute per IP address. When exceeding this limit, requests will return a 429 Too Many Requests status with a message indicating when to retry.

## Versioning

The current API is v1. Future API versions will be available at `/api/v2`, etc., when released.

## Examples

### Example: Searching for a Student
```javascript
const searchStudent = async (pid) => {
  const response = await fetch(`/api/search-by-pid?pid=${pid}`, {
    headers: {
      'Authorization': localStorage.getItem('userRole')
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch student data');
  }
  
  return response.json();
};
```

### Example: Allocating a U-Pass
```javascript
const allocateUPass = async (pid, upassId) => {
  const response = await fetch('/api/allocate-upass', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('userRole')
    },
    body: JSON.stringify({ pid, upassId })
  });
  
  if (!response.ok) {
    throw new Error('Failed to allocate U-Pass');
  }
  
  return response.json();
};
