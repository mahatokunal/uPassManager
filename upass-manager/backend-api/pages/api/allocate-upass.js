// backend-api/pages/api/allocate-upass.js
import pool from '../../db';

/**
 * API handler for allocating or replacing U-Pass cards for students
 * 
 * This endpoint validates the incoming request, checks if the student has signed
 * the required disclaimer, and either allocates a new U-Pass or replaces an existing one.
 * 
 * @async
 * @function allocateUPassHandler
 * @param {Object} req - Next.js API request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.pid - Student's 9-digit personal identifier (PID)
 * @param {string} req.body.upassId - The new U-Pass card number to allocate
 * @param {Object} res - Next.js API response object
 * @returns {Promise<Object>} JSON response with success or error message
 * 
 * @example
 * // Request
 * // POST /api/allocate-upass
 * // {
 * //   "pid": "123456789",
 * //   "upassId": "01670000001234567893"
 * // }
 * 
 * @example
 * // Success response (new allocation)
 * // {
 * //   "message": "U-Pass allocated successfully",
 * //   "success": true,
 * //   "isReplacement": false
 * // }
 * 
 * @example
 * // Success response (replacement)
 * // {
 * //   "message": "U-Pass replaced successfully",
 * //   "success": true,
 * //   "isReplacement": true
 * // }
 * 
 * @example
 * // Error response (disclaimer not signed)
 * // {
 * //   "message": "Disclaimer must be signed before allocating a U-Pass",
 * //   "disclaimerSigned": false
 * // }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { pid, upassId } = req.body;
  
  if (!pid) {
    return res.status(400).json({ message: 'PID is required' });
  }

  if (!upassId) {
    return res.status(400).json({ message: 'U-Pass ID is required' });
  }

  // Validate PID format (9 digits)
  if (!/^\d{9}$/.test(pid)) {
    return res.status(400).json({ message: 'PID must be a 9-digit number' });
  }

  console.log('Numeric U-Pass ID:', upassId);
  console.log('Allocating U-Pass for PID:', pid, 'U-Pass ID:', upassId);
  
  let connection;
  try {
    // Get a connection from the pool
    connection = await pool.getConnection();
    
    // First check if the disclaimer is signed and if there's an existing active card
    const [checkRows] = await connection.query(
      'SELECT Disclaimer_Signed, Active_U_Pass_Card FROM u_pass_manager_current WHERE Student_ID = ?',
      [pid]
    );
    
    if (checkRows.length === 0) {
      return res.status(404).json({ message: 'No record found for the provided PID' });
    }
    
    if (!checkRows[0].Disclaimer_Signed) {
      return res.status(400).json({ 
        message: 'Disclaimer must be signed before allocating a U-Pass',
        disclaimerSigned: false
      });
    }
    
    const currentCard = checkRows[0].Active_U_Pass_Card;
    
    // If student already has an active card, move it to replaced cards before adding new one
    if (currentCard) {
      console.log(`Replacing card: Moving ${currentCard} to replaced cards`);
      
      // Update both Active_U_Pass_Card and Replaced_U_Pass_Card in a single query
      const [result] = await connection.query(
        'UPDATE u_pass_manager_current SET Active_U_Pass_Card = ?, Replaced_U_Pass_Card = ? WHERE Student_ID = ?',
        [upassId, currentCard, pid]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Failed to update record' });
      }
    } else {
      // No existing card, just update the Active_U_Pass_Card field
      const [result] = await connection.query(
        'UPDATE u_pass_manager_current SET Active_U_Pass_Card = ? WHERE Student_ID = ?',
        [upassId, pid]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Failed to update record' });
      }
    }

    // Return success message
    return res.status(200).json({ 
      message: currentCard ? 'U-Pass replaced successfully' : 'U-Pass allocated successfully',
      success: true,
      isReplacement: !!currentCard
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message,
      stack: error.stack
    });
  } finally {
    // Always release the connection back to the pool
    if (connection) {
      connection.release();
      console.log('Database connection released in allocate-upass');
    }
  }
}