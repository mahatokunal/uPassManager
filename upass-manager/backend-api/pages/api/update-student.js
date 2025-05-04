/**
 * @file API endpoint for updating student UPass information
 * @description Handles updates to student records in the UPass management system
 * @module backend-api/pages/api/update-student
 */
import pool from '../../db';

/**
 * Updates a student record in the database based on provided fields
 * 
 * @async
 * @function handler
 * @param {Object} req - The HTTP request object
 * @param {Object} req.body - The request body containing fields to update
 * @param {string} req.body.Student_ID - The 9-digit student ID (required)
 * @param {string} [req.body.Active_U_Pass_Card] - Current active UPass card number
 * @param {string} [req.body.Replaced_U_Pass_Card] - Previous replaced UPass card number
 * @param {boolean} [req.body.Disclaimer_Signed] - Whether student has signed disclaimer
 * @param {string} [req.body.Metro_Acct] - Metro account information
 * @param {string} [req.body.Distribution_Date] - Date when UPass was distributed
 * @param {string} [req.body.Picked_Up_By] - Person who picked up the UPass
 * @param {string} [req.body.Notes] - Additional notes about the student
 * @param {string} [req.body.U_Pass_ID] - UPass ID number
 * @param {Object} res - The HTTP response object
 * @returns {Object} JSON response indicating success or failure
 * 
 * @example
 * // Request body
 * {
 *   "Student_ID": "123456789",
 *   "Active_U_Pass_Card": "A12345678",
 *   "Disclaimer_Signed": true,
 *   "Distribution_Date": "2025-05-01"
 * }
 * 
 * // Success response (200 OK)
 * {
 *   "message": "Student record updated successfully",
 *   "success": true
 * }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { 
    Student_ID, 
    Active_U_Pass_Card, 
    Replaced_U_Pass_Card, 
    Disclaimer_Signed, 
    Metro_Acct, 
    Distribution_Date, 
    Picked_Up_By, 
    Notes, 
    U_Pass_ID 
  } = req.body;
  
  if (!Student_ID) {
    return res.status(400).json({ message: 'Student ID is required' });
  }

  // Validate Student_ID format (9 digits)
  if (!/^\d{9}$/.test(Student_ID)) {
    return res.status(400).json({ message: 'Student ID must be a 9-digit number' });
  }
  
  try {
    // Build the update query dynamically based on provided fields
    let updateFields = [];
    let queryParams = [];
    
    if (Active_U_Pass_Card !== undefined) {
      updateFields.push('Active_U_Pass_Card = ?');
      // Ensure UPass number is stored as a string by wrapping it in quotes
      queryParams.push(String(Active_U_Pass_Card));
    }
    
    if (Replaced_U_Pass_Card !== undefined) {
      updateFields.push('Replaced_U_Pass_Card = ?');
      // Ensure UPass number is stored as a string by wrapping it in quotes
      queryParams.push(String(Replaced_U_Pass_Card));
    }
    
    if (Disclaimer_Signed !== undefined) {
      updateFields.push('Disclaimer_Signed = ?');
      queryParams.push(Disclaimer_Signed ? 1 : 0);
    }
    
    if (Metro_Acct !== undefined) {
      updateFields.push('Metro_Acct = ?');
      queryParams.push(Metro_Acct);
    }
    
    if (Distribution_Date !== undefined) {
      updateFields.push('Distribution_Date = ?');
      queryParams.push(Distribution_Date);
    }
    
    if (Picked_Up_By !== undefined) {
      updateFields.push('Picked_Up_By = ?');
      queryParams.push(Picked_Up_By);
    }
    
    if (Notes !== undefined) {
      updateFields.push('Notes = ?');
      queryParams.push(Notes);
    }
    
    if (U_Pass_ID !== undefined) {
      updateFields.push('U_Pass_ID = ?');
      queryParams.push(U_Pass_ID);
    }
    
    // If no fields to update, return error
    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    // Add Student_ID to query params
    queryParams.push(Student_ID);
    
    // Execute the update query
    const [result] = await pool.query(
      `UPDATE u_pass_manager_current SET ${updateFields.join(', ')} WHERE Student_ID = ?`,
      queryParams
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No record found for the provided Student ID' });
    }

    // Return success message
    return res.status(200).json({ 
      message: 'Student record updated successfully',
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
