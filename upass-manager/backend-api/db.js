// db.js
import mysql from 'mysql2/promise';

// Create a connection pool to manage multiple connections efficiently
const pool = mysql.createPool({
  host: process.env.DB_HOST,         // AWS RDS endpoint
  user: process.env.DB_USER,         // Database username
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_DATABASE, // Database name
  port: process.env.DB_PORT,         // Database port (usually 3306)
  waitForConnections: true,
  connectionLimit: 25,               // Increased from 10 to 25
  queueLimit: 0,
  enableKeepAlive: true,             // Enable keep-alive to prevent stale connections
  keepAliveInitialDelay: 10000,      // 10 seconds
  namedPlaceholders: true,           // More efficient query preparation
  connectTimeout: 10000,             // 10 seconds connection timeout
  idleTimeout: 60000,                // Close idle connections after 60 seconds
});

// Function to check pool health and log connection stats
const checkPoolHealth = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    
    // Get connection stats
    const [rows] = await connection.query('SHOW STATUS LIKE "Conn%"');
    console.log('Connection stats:', rows);
    
    connection.release();
  } catch (error) {
    console.error('Database connection health check failed:', error);
  }
};

// Run health check on startup
checkPoolHealth();

// Set up periodic health checks (every 5 minutes)
setInterval(checkPoolHealth, 300000);

export default pool;
