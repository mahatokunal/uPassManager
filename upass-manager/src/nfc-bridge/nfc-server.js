/**
 * @file NFC Bridge Server
 * @description WebSocket server that bridges communication between NFC card readers and the web application
 * @module nfc-bridge/nfc-server
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const pcsc = require('pcsclite');

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

/**
 * Initialize PC/SC (PC/Smart Card) library for interfacing with NFC readers
 * @type {Object|null} The PC/SC instance or null if initialization failed
 */
let pcscInstance;
try {
  pcscInstance = pcsc();
  console.log('PC/SC initialized successfully');
} catch (error) {
  console.error('Failed to initialize PC/SC:', error.message);
  console.error('Make sure PC/SC drivers are installed and the PC/SC service is running');
  process.exit(1);
}

/**
 * Store active NFC readers
 * @type {Object.<string, Object>} Map of reader names to reader objects
 */
const readers = {};

/**
 * Track if any clients are currently connected
 * @type {boolean}
 */
let isConnected = false;

/**
 * Converts byte array to hexadecimal string
 * 
 * @param {Buffer|Uint8Array} bytes - Array of bytes to convert
 * @returns {string} Hexadecimal string representation
 */
function bytesToHexString(bytes) {
  return Array.from(bytes)
    .map(byte => (byte < 0x10 ? '0' : '') + byte.toString(16).toUpperCase())
    .join('');
}

/**
 * Calculate the checksum for UPass card numbers
 * Uses the same algorithm as in the VBA code
 * 
 * @param {string} value - Card number string to calculate checksum for
 * @returns {number} The calculated checksum digit
 */
function getChecksum(value) {
  const delta = [0, 1, 2, 3, 4, -4, -3, -2, -1, 0];
  let sum = 0;
  
  // Sum all digits
  for (let i = 0; i < value.length; i++) {
    sum += parseInt(value.charAt(i), 10);
  }
  
  // Apply delta values
  let i = value.length - 1;
  while (i >= 0) {
    const deltaIndex = parseInt(value.charAt(i), 10);
    const deltaValue = delta[deltaIndex];
    sum += deltaValue;
    i -= 2;
  }
  
  // Calculate final checksum
  sum = 10 - (sum % 10);
  return sum === 10 ? 0 : sum;
}

/**
 * Format raw card data into a valid UPass card number
 * Uses the same algorithm as in the VBA code
 * 
 * @param {Buffer} data - Raw card data from the NFC reader
 * @returns {string} Formatted 20-digit UPass card number or empty string if invalid
 */
function formatCardNumber(data) {
  // Convert bytes to hex string (skip first byte and last two bytes)
  const hexStr = bytesToHexString(data.slice(1, data.length - 2));
  
  // Convert hex to decimal
  let longVal = 0n;
  for (let i = 0; i < hexStr.length; i++) {
    const hexDigit = hexStr.charAt(hexStr.length - 1 - i);
    const decValue = BigInt(parseInt(hexDigit, 16));
    longVal += decValue * (16n ** BigInt(i));
  }
  
  // Convert to string and pad with leading zeros
  let longStr = longVal.toString();
  while (longStr.length < 15) {
    longStr = '0' + longStr;
  }
  
  // Return empty string if all zeros
  if (longStr === '000000000000000') {
    return '';
  }
  
  // Add prefix and checksum
  longStr = '0167' + longStr;
  return longStr + getChecksum(longStr);
}

/**
 * Handle PC/SC reader events for new readers detected
 * Sets up event handlers for card insertion, removal, and errors
 */
pcscInstance.on('reader', function(reader) {
  console.log('New reader detected:', reader.name);
  
  // Only use ACS readers
  if (!reader.name.includes('ACS')) {
    console.log('Ignoring non-ACS reader:', reader.name);
    return;
  }
  
  // Store reader
  readers[reader.name] = reader;
  
  // Notify all clients about the new reader
  io.emit('readerConnected', { name: reader.name });
  
  /**
   * Handle reader status changes (card insertion/removal)
   */
  reader.on('status', function(status) {
    const changes = this.state ^ status.state;
    
    // Card removed
    if ((changes & this.SCARD_STATE_EMPTY) && (status.state & this.SCARD_STATE_EMPTY)) {
      io.emit('cardRemoved', { reader: reader.name });
    }
    
    // Card inserted
    if ((changes & this.SCARD_STATE_PRESENT) && (status.state & this.SCARD_STATE_PRESENT)) {
      // Connect to card
      reader.connect({ share_mode: this.SCARD_SHARE_SHARED }, function(err, protocol) {
        if (err) {
          console.error('Error connecting to card:', err);
          io.emit('error', { message: 'Error connecting to card', error: err.message });
          return;
        }
        
        // Command to get UID (same as in VBA code)
        const command = Buffer.from([0xFF, 0xCA, 0x00, 0x00, 0x00]);
        
        // Send command to card
        reader.transmit(command, 16, protocol, function(err, data) {
          if (err) {
            console.error('Error transmitting to card:', err);
            io.emit('error', { message: 'Error reading card', error: err.message });
            return;
          }
          
          // Format card number
          const cardNumber = formatCardNumber(data);
          
          if (cardNumber) {
            console.log('Card detected:', cardNumber);
            io.emit('cardDetected', { reader: reader.name, cardNumber });
          } else {
            console.error('Invalid card data received');
            io.emit('error', { message: 'Invalid card data received' });
          }
          
          // Disconnect from card
          reader.disconnect(reader.SCARD_LEAVE_CARD, function(err) {
            if (err) {
              console.error('Error disconnecting from card:', err);
            }
          });
        });
      });
    }
    
    this.state = status.state;
  });
  
  /**
   * Handle reader disconnection
   */
  reader.on('end', function() {
    console.log('Reader removed:', this.name);
    delete readers[this.name];
    io.emit('readerDisconnected', { name: this.name });
  });
  
  /**
   * Handle reader errors
   */
  reader.on('error', function(err) {
    console.error('Reader error:', err);
    io.emit('error', { message: 'Reader error', error: err.message });
  });
});

/**
 * Handle PC/SC instance errors
 */
pcscInstance.on('error', function(err) {
  console.error('PCSC error:', err);
  io.emit('error', { message: 'PCSC error', error: err.message });
});

/**
 * Handle new client connections
 * Sends list of available readers to the client
 */
io.on('connection', (socket) => {
  isConnected = true;
  console.log('Client connected, ID:', socket.id);
  console.log('Total connected clients:', io.engine.clientsCount);
  
  // Send list of available readers to the client
  const readerList = Object.keys(readers);
  socket.emit('readers', readerList);
  
  if (readerList.length === 0) {
    console.log('No readers available to send to client');
    socket.emit('error', { 
      message: 'No card readers detected', 
      error: 'Make sure your card reader is connected and recognized by the system' 
    });
  } else {
    console.log('Available readers sent to client:', readerList);
  }
  
  /**
   * Handle client disconnection
   */
  socket.on('disconnect', (reason) => {
    console.log('Client disconnected, ID:', socket.id, 'Reason:', reason);
    console.log('Remaining connected clients:', io.engine.clientsCount);
    
    if (io.engine.clientsCount === 0) {
      isConnected = false;
      console.log('No clients connected');
    }
  });
  
  /**
   * Handle socket errors
   */
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

/**
 * Handle server connection errors
 */
io.engine.on('connection_error', (err) => {
  console.error('Connection error:', err);
});

/**
 * API endpoint to get list of available NFC readers
 * @route GET /api/readers
 * @returns {Object} JSON object with reader information
 */
app.get('/api/readers', (req, res) => {
  const readerList = Object.keys(readers);
  res.json({ 
    readers: readerList,
    count: readerList.length,
    status: readerList.length > 0 ? 'ok' : 'no_readers',
    connected_clients: io.engine.clientsCount
  });
});

/**
 * API endpoint to get server status
 * @route GET /api/status
 * @returns {Object} JSON object with server status information
 */
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    readers: Object.keys(readers),
    reader_count: Object.keys(readers).length,
    connected_clients: io.engine.clientsCount,
    uptime: process.uptime()
  });
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ error: err.message });
});

/**
 * Start the server on the specified port
 */
const PORT = process.env.PORT || 3001;
server.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log(`NFC Bridge server running on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`- GET http://localhost:${PORT}/api/readers`);
  console.log(`- GET http://localhost:${PORT}/api/status`);
});

/**
 * Handle server errors
 */
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please choose a different port or stop the other process.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

/**
 * Handle process termination
 */
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});
