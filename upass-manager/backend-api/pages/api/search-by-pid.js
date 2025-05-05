// backend-api/pages/api/search-by-pid.js
import pool from '../../db';

/**
 * API handler to search for a student record by their PID (Personal Identifier)
 *
 * This endpoint searches the current U-Pass database table for a student record
 * matching the provided PID (Student_ID).
 *
 * @async
 * @function handler
 * @param {object} req - The HTTP request object
 * @param {object} req.query - Query parameters
 * @param {string} req.query.pid - The 9-digit PID (Student ID) to search for
 * @param {object} res - The HTTP response object
 * @returns {Promise<object>} JSON response containing the student record or error message
 * 
 * @example
 * // Request: GET /api/search-by-pid?pid=123456789
 * 
 * @example
 * // Success response:
 * // {
 * //   "message": "Record found",
 * //   "data": {
 * //     "Student_ID": "123456789",
 * //     "First_Name": "John",
 * //     "Last_Name": "Doe",
 * //     "Email": "john.doe@example.com",
 * //     "Active_U_Pass_Card": "1234567890",
 * //     "Disclaimer_Signed": 1,
 * //     ... other fields ...
 * //   }
 * // }
 * 
 * @example
 * // Error response (no record found):
 * // {
 * //   "message": "No record found for the provided PID"
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
      'SELECT * FROM u_pass_manager_current WHERE Student_ID = ?',
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
