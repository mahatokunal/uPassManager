// backend-api/pages/api/allocate-upass.js
import pool from '../../db';

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
  
  // Ensure upassId is a number (for BIGINT field)
  const numericUpassId = Number(upassId);
  if (isNaN(numericUpassId)) {
    return res.status(400).json({ message: 'U-Pass ID must be a valid number' });
  }
  
  console.log('Numeric U-Pass ID:', numericUpassId);

  console.log('Allocating U-Pass for PID:', pid, 'U-Pass ID:', upassId);
  
  try {
    // First check if the disclaimer is signed
    const [checkRows] = await pool.query(
      'SELECT Disclaimer_Signed FROM u_pass_manager WHERE ID_Number = ?',
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
    
    // Update the Active_U_Pass_Card field with the new U-Pass ID (as a number)
    const [result] = await pool.query(
      'UPDATE u_pass_manager SET Active_U_Pass_Card = ? WHERE ID_Number = ?',
      [numericUpassId, pid]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Failed to update record' });
    }

    // Return success message
    return res.status(200).json({ 
      message: 'U-Pass allocated successfully',
      success: true
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message,
      stack: error.stack
    });
  }
}
