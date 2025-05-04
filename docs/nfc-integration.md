# NFC Integration Documentation

## Overview

The NFC integration component of the U-Pass Manager allows distributors to seamlessly scan U-Pass cards using an NFC card reader. This feature streamlines the allocation process, reduces manual data entry errors, and improves efficiency.

## Architecture

The NFC integration consists of three main components:

1. **NFC Bridge Server**: A Node.js server that communicates with NFC card readers using the PC/SC API.
2. **WebSocket Connection**: A real-time communication channel between the NFC Bridge Server and the U-Pass Manager application.
3. **NFCModal Component**: A React component in the U-Pass Manager application that displays the UI for allocating U-Pass cards and receives card data from the NFC Bridge Server.

## Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  NFC Card       │────▶│  NFC Bridge     │────▶│  UPass Manager  │
│  Reader         │     │  Server         │     │  Application    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
       PC/SC API              WebSocket            React Component
```

## Data Flow

1. **Card Detection**:
   - User places an NFC card on the NFC card reader
   - The NFC Bridge Server detects the card via the PC/SC API
   - The server reads the card's UID and formats it according to the required format
   - The server sends the card data to connected clients via WebSocket

2. **Data Processing in UPass Manager**:
   - The NFCModal component in the U-Pass Manager application receives the card data
   - The card number is displayed in the input field
   - The user can confirm the allocation by clicking the "Allocate U-Pass" button
   - The application sends an API request to update the database with the new U-Pass allocation

## Component Details

### 1. NFC Bridge Server

The NFC Bridge Server is a Node.js application that uses the following libraries:

- **pcsclite**: A Node.js wrapper for the PC/SC API, which allows communication with smart card readers
- **express**: A web framework for creating HTTP endpoints
- **socket.io**: A library for real-time, bidirectional communication between clients and server

**Key Functionality**:
- Initializes the PC/SC middleware
- Detects and monitors NFC card readers
- Reads card data when a card is placed on a reader
- Formats the card data according to the required format
- Sends the card data to connected clients via WebSocket
- Provides HTTP endpoints for status and diagnostics

### 2. WebSocket Connection

The WebSocket connection is established between the NFC Bridge Server and the UPass Manager application using the Socket.IO library. This allows for real-time, bidirectional communication between the two components.

**Key Events**:
- **readers**: List of available NFC readers
- **readerConnected**: Sent when a new NFC reader is connected
- **readerDisconnected**: Sent when an NFC reader is disconnected
- **cardDetected**: Sent when an NFC card is detected, includes the card number
- **cardRemoved**: Sent when an NFC card is removed from the reader
- **error**: Sent when an error occurs

### 3. NFCModal Component

The NFCModal component is a React component in the UPass Manager application that displays the UI for allocating U-Pass cards. It performs the following functions:

- Connects to the NFC Bridge Server via WebSocket when opened
- Displays the student information for whom the U-Pass is being allocated
- Provides an input field for the U-Pass number
- Receives card data from the NFC Bridge Server and fills in the input field
- Allows the user to confirm the allocation by clicking the "Allocate U-Pass" button
- Sends an API request to update the database with the new U-Pass allocation
- Disconnects from the NFC Bridge Server when closed

## Installation and Setup

### Prerequisites

- Node.js (v14 or higher)
- PC/SC middleware installed on your system:
  - Windows: PC/SC comes pre-installed
  - macOS: Install [PCSC-Lite](https://pcsclite.apdu.fr/)
  - Linux: Install `pcscd` and `libpcsclite-dev` packages
- NFC card reader (ACS ACR122U or compatible)

### Setup Steps

1. **Run the NFC Setup Script**
   ```bash
   npm run setup-nfc
   ```
   This script will install all necessary dependencies for both the main application and the NFC bridge server.

2. **Start the NFC Bridge Server**
   ```bash
   cd src/nfc-bridge
   npm start
   ```
   or from the root directory:
   ```bash
   npm run nfc-server
   ```

3. **Connect the NFC Card Reader**
   Connect your NFC card reader to your computer. The NFC bridge server will automatically detect it.

4. **Use the NFC Scanner in the Application**
   - Log in to the UPass Manager application
   - Search for a student by PID
   - Click "Allocate U-Pass"
   - The NFCModal will open and establish a connection to the NFC Bridge Server
   - Place an NFC card on the reader to scan it
   - The card number will be automatically filled in the input field
   - Click "Allocate U-Pass" to complete the allocation

## Troubleshooting

### Common Issues

1. **NFC Bridge Server Won't Start**
   - Ensure that the PC/SC middleware is properly installed
   - Check if there are any conflicting processes using the same port (default: 3001)
   - Verify that Node.js is installed correctly

2. **Card Reader Not Detected**
   - Make sure the card reader is properly connected
   - Try reconnecting the card reader
   - Restart the NFC Bridge Server
   - Check if the card reader is supported by the PC/SC API

3. **Card Not Reading**
   - Ensure the card is placed correctly on the reader
   - Try using a different card to see if the issue is with the specific card
   - Verify that the card is a compatible NFC card
   - Check the NFC Bridge Server logs for any errors

4. **WebSocket Connection Fails**
   - Verify that the NFC Bridge Server is running
   - Check if the server URL is correctly configured in the environment variables
   - Look for any network issues that might prevent the connection

### Logs and Diagnostics

- **NFC Bridge Server Logs**: Check the terminal where the NFC Bridge Server is running for error messages and debugging information
- **Browser Console**: Look for WebSocket connection errors or other client-side issues in the browser console
- **API Endpoints**: Use the following endpoints to check the status of the NFC Bridge Server:
  - `GET http://localhost:3001/api/status`: Returns the status of the NFC Bridge Server
  - `GET http://localhost:3001/api/readers`: Returns a list of connected NFC readers

## Security Considerations

- The NFC Bridge Server only runs locally on the user's machine
- The WebSocket connection is only accessible from the local machine
- The card data is only transmitted over the local network
- No sensitive data is stored in the NFC Bridge Server

## Future Enhancements

Planned enhancements for the NFC integration include:
- Support for more types of NFC card readers
- Encrypted WebSocket communication
- Authentication for the WebSocket connection
- Improved error handling and recovery
- Support for reading additional data from NFC cards
- Batch scanning mode for multiple cards

## API Reference

### WebSocket Events

#### Client to Server

- **connect**: Establish a connection to the NFC Bridge Server
- **disconnect**: Disconnect from the NFC Bridge Server

#### Server to Client

- **readers**: Sent when the client connects, contains a list of available readers
  ```json
  {
    "readers": ["ACS ACR122U 00 00"]
  }
  ```

- **readerConnected**: Sent when a new reader is connected
  ```json
  {
    "reader": "ACS ACR122U 00 00"
  }
  ```

- **readerDisconnected**: Sent when a reader is disconnected
  ```json
  {
    "reader": "ACS ACR122U 00 00"
  }
  ```

- **cardDetected**: Sent when a card is detected
  ```json
  {
    "reader": "ACS ACR122U 00 00",
    "cardNumber": "12345678901234567890"
  }
  ```

- **cardRemoved**: Sent when a card is removed
  ```json
  {
    "reader": "ACS ACR122U 00 00"
  }
  ```

- **error**: Sent when an error occurs
  ```json
  {
    "message": "Error message"
  }
  ```

### HTTP API

- **GET /api/status**: Returns the status of the NFC Bridge Server
  ```json
  {
    "status": "running",
    "uptime": "1h 23m 45s",
    "readers": 1
  }
  ```

- **GET /api/readers**: Returns a list of connected NFC readers
  ```json
  {
    "readers": [
      {
        "name": "ACS ACR122U 00 00",
        "connected": true,
        "cardPresent": false
      }
    ]
  }
  ```

## Related Files

- **src/nfc-bridge/nfc-server.js**: Main NFC Bridge Server file
- **src/app/components/NFCModal.js**: React component for the NFC modal
- **setup-nfc.js**: Setup script for NFC integration
- **update-nfc.js**: Update script for NFC integration
- **uninstall-nfc.js**: Uninstall script for NFC integration