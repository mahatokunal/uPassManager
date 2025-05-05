# NFC Integration Architecture

This document describes the architecture and data flow of the NFC integration in the UPass Manager application.

## Overview

The NFC integration consists of three main components:

1. **NFC Bridge Server**: A Node.js server that communicates with NFC card readers using the PC/SC API.
2. **WebSocket Connection**: A real-time communication channel between the NFC Bridge Server and the UPass Manager application.
3. **NFCModal Component**: A React component in the UPass Manager application that displays the UI for allocating U-Pass cards and receives card data from the NFC Bridge Server.

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
   - The NFCModal component in the UPass Manager application receives the card data
   - The card number is displayed in the input field
   - The user can confirm the allocation by clicking the "Allocate U-Pass" button
   - The application sends an API request to update the database with the new U-Pass allocation

3. **Backend Processing**:
   - The API endpoint processes the U-Pass allocation request
   - The database is updated with the new U-Pass card number
   - A confirmation response is sent back to the frontend
   - The NFCModal displays a success message and closes

## Component Details

### NFC Bridge Server

The NFC Bridge Server is a Node.js application that uses the following libraries:

- **pcsclite**: A Node.js wrapper for the PC/SC API, which allows communication with smart card readers
- **express**: A web framework for creating HTTP endpoints
- **socket.io**: A library for real-time, bidirectional communication between clients and server

The server performs the following functions:

1. Initializes the PC/SC middleware
2. Detects and monitors NFC card readers
3. Reads card data when a card is placed on a reader
4. Formats the card data according to the required format
5. Sends the card data to connected clients via WebSocket
6. Provides HTTP endpoints for status and diagnostics

#### Implementation Details

The NFC Bridge Server is implemented in the `nfc-server.js` file. The server listens on port 3001 by default and exposes both HTTP and WebSocket endpoints.

```javascript
// Server initialization
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
const pcsc = require('pcsclite');
const pcsclite = pcsc();

// Start the server
server.listen(3001, () => {
  console.log('NFC Bridge Server listening on port 3001');
});
```

The server handles card reader events with the following code pattern:

```javascript
// Monitor for reader connections
pcsclite.on('reader', function(reader) {
  console.log('Reader detected:', reader.name);
  
  // Notify connected clients about the new reader
  io.emit('readerConnected', { reader: reader.name });
  
  // Handle card insertion
  reader.on('status', function(status) {
    // Card detection logic
  });
  
  // Handle errors
  reader.on('error', function(err) {
    console.log('Reader error:', err.message);
    io.emit('error', { message: err.message });
  });
});
```

### WebSocket Connection

The WebSocket connection is established between the NFC Bridge Server and the UPass Manager application using the Socket.IO library. This allows for real-time, bidirectional communication between the two components.

The following events are used:

- **readers**: List of available NFC readers
- **readerConnected**: Sent when a new NFC reader is connected
- **readerDisconnected**: Sent when an NFC reader is disconnected
- **cardDetected**: Sent when an NFC card is detected, includes the card number
- **cardRemoved**: Sent when an NFC card is removed from the reader
- **error**: Sent when an error occurs

#### Socket.IO Implementation

The Socket.IO server is configured with CORS to allow connections from the UPass Manager application:

```javascript
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send list of available readers to the newly connected client
  socket.emit('readers', readers);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
```

### NFCModal Component

The NFCModal component is a React component in the UPass Manager application that displays the UI for allocating U-Pass cards. It performs the following functions:

1. Connects to the NFC Bridge Server via WebSocket when opened
2. Displays the student information for whom the U-Pass is being allocated
3. Provides an input field for the U-Pass number
4. Receives card data from the NFC Bridge Server and fills in the input field
5. Allows the user to confirm the allocation by clicking the "Allocate U-Pass" button
6. Sends an API request to update the database with the new U-Pass allocation
7. Disconnects from the NFC Bridge Server when closed

#### React Component Implementation

The NFCModal is implemented as a React component that uses the Socket.IO client library to connect to the NFC Bridge Server:

```javascript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;

const NFCModal = ({ isOpen, onClose, studentInfo, onAllocate }) => {
  const [upassId, setUpassId] = useState('');
  const [readers, setReaders] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');

  // Connect to NFC Bridge Server
  useEffect(() => {
    if (!isOpen) return;
    
    // Initialize socket connection
    socket = io('http://localhost:3001');
    
    // Set up event listeners
    socket.on('readers', (readers) => {
      setReaders(readers);
    });
    
    socket.on('cardDetected', (data) => {
      setUpassId(data.cardNumber);
    });
    
    socket.on('error', (data) => {
      setError(data.message);
    });
    
    return () => {
      // Clean up socket connection when component unmounts
      if (socket) socket.disconnect();
    };
  }, [isOpen]);
  
  // Handle allocation button click
  const handleAllocate = () => {
    onAllocate(upassId);
  };
  
  // Render modal UI
}
```

## Card Number Format

The card number format follows a specific pattern:

1. The card's UID is read from the NFC card
2. The UID is converted to a hexadecimal string
3. The hexadecimal string is converted to a decimal number
4. The decimal number is padded with leading zeros to 15 digits
5. The prefix "0167" is added to the beginning
6. A checksum digit is calculated and added to the end
7. The final card number is a 20-digit number

### Card Number Calculation Example

For a card with UID `04:1A:2B:3C`:

1. Convert to hex string: `041A2B3C`
2. Convert to decimal: `68426556`
3. Pad to 15 digits: `000000068426556`
4. Add prefix: `0167000000068426556`
5. Calculate checksum: `9`
6. Final card number: `01670000000684265569`

### Checksum Algorithm

The checksum calculation algorithm is as follows:

1. Sum all digits in the card number
2. Apply delta values to every other digit, starting from the last digit
3. Calculate the final checksum as 10 minus the modulo 10 of the sum
4. If the result is 10, use 0 instead

```javascript
function calculateChecksum(digits) {
  // Convert to array of digits
  const digitArray = digits.split('').map(d => parseInt(d));
  
  // Calculate sum with delta values
  let sum = 0;
  for (let i = 0; i < digitArray.length; i++) {
    let value = digitArray[i];
    // Apply delta to odd positions (from right to left)
    if ((digitArray.length - i) % 2 === 1) {
      value *= 2;
      if (value > 9) value -= 9;
    }
    sum += value;
  }
  
  // Calculate checksum
  const checksum = (10 - (sum % 10)) % 10;
  return checksum;
}
```

## Security Considerations

- The NFC Bridge Server only runs locally on the user's machine
- The WebSocket connection is only accessible from the local machine
- The card data is only transmitted over the local network
- No sensitive data is stored in the NFC Bridge Server

### Security Enhancements

For enhanced security, consider implementing the following measures:

1. **HTTPS**: Use HTTPS for all API communication
2. **WebSocket Security**: Add authentication for WebSocket connections
3. **Rate Limiting**: Implement rate limiting to prevent brute force attacks
4. **Input Validation**: Validate all card data to prevent injection attacks
5. **Logging**: Implement secure logging mechanisms that do not log sensitive information

## Installation and Setup

To install and run the NFC Bridge Server:

1. Install the required dependencies:
   ```bash
   cd src/nfc-bridge
   npm install
   ```

2. Connect an NFC card reader to your machine

3. Start the NFC Bridge Server:
   ```bash
   node nfc-server.js
   ```

4. Verify the server is running by opening http://localhost:3001 in a browser

### Troubleshooting

If you encounter issues with the NFC card reader:

1. Check that the card reader is properly connected
2. Verify that the pcsclite service is running on your system
3. Ensure you have the proper permissions to access the card reader
4. Try running the test script to verify the card reader is working:
   ```bash
   node check-reader.js
   ```
5. For more detailed troubleshooting, refer to [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## Deployment

The NFC integration is deployed as follows:

1. The NFC Bridge Server is installed and run on the user's machine
2. The UPass Manager application is accessed via a web browser
3. When the NFCModal is opened, it connects to the NFC Bridge Server
4. The user places an NFC card on the reader to allocate a U-Pass

### Production Deployment Considerations

In a production environment:

1. Consider packaging the NFC Bridge Server as a standalone executable using tools like [pkg](https://github.com/vercel/pkg)
2. Set up auto-start mechanisms for the NFC Bridge Server
3. Implement error recovery procedures
4. Configure proper firewall rules to restrict access to the WebSocket server

## Future Improvements

- Add support for more types of NFC card readers
- Implement encryption for the WebSocket connection
- Add authentication for the WebSocket connection
- Improve error handling and recovery
- Add support for reading additional data from the NFC card
- Create a native desktop application wrapper for improved user experience
- Add support for offline operation with synchronization capabilities
