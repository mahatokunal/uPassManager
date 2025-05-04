/**
 * @file login.js
 * @description API endpoint for user authentication and login
 * @module backend-api/pages/api/login
 */
// backend-api/pages/api/login.js
import { authenticateUser, generateToken } from '../../../backend-common/auth'; // Adjust the relative path as needed

/**
 * API handler for user authentication
 * Validates credentials and returns user role upon successful login
 *
 * @async
 * @function handler
 * @param {Object} req - The HTTP request object
 * @param {Object} req.body - The request body
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - The HTTP response object
 * @returns {Object} JSON response with authentication result
 *
 * @example
 * // Example request:
 * // POST /api/login
 * // {
 * //   "email": "admin@example.com",
 * //   "password": "secure_password"
 * // }
 */
export default async function handler(req, res) {

  //test comment

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const authResult = await authenticateUser(email, password);
  if (authResult.error) {
    return res.status(401).json({ message: authResult.error });
  }

//   // Generate JWT token upon successful authentication.
//   const token = generateToken(authResult.user);
  return res.status(200).json({
    message: 'Login successful',
    role: authResult.user.role,
    // token,  // Optional: if you need a token for session management.
  });
}
