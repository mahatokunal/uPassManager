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
  connectionLimit: 20,               // Increased from 10 to 20
  queueLimit: 0,
  debug: false,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000, // 10 seconds
});

// Helper function to execute queries safely with automatic connection release
export async function executeQuery(query, params = []) {
  try {
    const [results] = await pool.query(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default pool;
