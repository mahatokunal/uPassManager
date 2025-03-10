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
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
