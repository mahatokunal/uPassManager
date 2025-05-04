/**
 * @file search-by-pid.js
 * @description API endpoint for searching U-Pass records by PID (Student ID)
 * @module api/search-by-pid
 */

import pool from '../../db';

/**
 * Handler function for searching U-Pass records by PID.
 * This endpoint validates the PID format and queries the database for matching records.
 * 
 * @async
 * @function handler
 * @param {Object} req - The HTTP request object from Next.js
 * @param {Object} req.query - The query parameters
 * @param {string} req.query.pid - The 9-digit PID (Student ID) to search for
 * @param {Object} res - The HTTP response object from Next.js
 * @returns {Promise<Object>} JSON response with the search results or error message
 * @throws {Error} If database query fails
 * 
 * @example
 * // GET /api/search-by-pid?pid=123456789
 * // Response:
 * // {
 * //   "message": "Record found",
 * //   "data": { ... U-Pass record ... }
 * // }
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { pid } = req.query;
  
  if (!pid) {
    return res.status(400).json({ message: 'PID is required' });
  }

  // Validate PID format (9 digits)
  if (!/^\d{9}$/.test(pid)) {
    return res.status(400).json({ message: 'PID must be a 9-digit number' });
  }

  try {
    // Query the database for the U-Pass record using Student_ID (PID)
    const [rows] = await pool.query(
      'SELECT * FROM u_pass_manager WHERE Student_ID = ?',
      [pid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No record found for the provided PID' });
    }

    // Return the U-Pass record
    return res.status(200).json({ 
      message: 'Record found',
      data: rows[0]
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
