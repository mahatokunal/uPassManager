// backend-api/pages/api/getUpassData.js
import pool from '../../db.js';  // Import the database connection pool

export default async function handler(req, res) {
  // Only allow GET requests for this endpoint
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Execute the query to fetch all rows from the u_pass_manager table
    const [rows] = await pool.query('SELECT * FROM u_pass_manager');

    // Return the data as JSON
    return res.status(200).json({
      message: 'Data retrieved successfully',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
