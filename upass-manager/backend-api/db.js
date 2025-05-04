/**
 * @file db.js
 * @description Database connection pool configuration and query utilities
 * @module backend-api/db
 */

import mysql from 'mysql2/promise';

/**
 * MySQL connection pool for managing database connections efficiently
 * Uses environment variables for database configuration
 * 
 * @type {import('mysql2/promise').Pool}
 */
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

/**
 * Helper function to execute SQL queries safely with automatic connection release
 * 
 * @async
 * @function executeQuery
 * @param {string} query - SQL query string with placeholders
 * @param {Array} [params=[]] - Parameters to bind to query placeholders
 * @returns {Promise<Array>} Query results
 * @throws {Error} If query execution fails
 * 
 * @example
 * // Example usage:
 * try {
 *   const students = await executeQuery('SELECT * FROM students WHERE major = ?', ['Computer Science']);
 *   console.log(students);
 * } catch (error) {
 *   console.error('Query failed:', error);
 * }
 */
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
