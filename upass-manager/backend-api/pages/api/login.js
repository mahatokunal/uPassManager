// backend-api/pages/api/login.js
import { authenticateUser, generateToken } from '../../../backend-common/auth'; // Adjust the relative path as needed

/**
 * API handler for user authentication
 * 
 * This endpoint verifies user credentials against the database and
 * generates a JWT token for authenticated users.
 * 
 * @async
 * @function loginHandler
 * @param {Object} req - Next.js API request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Next.js API response object
 * @returns {Promise<Object>} JSON response with user data and token for successful login, or error message
 * 
 * @example
 * // Request
 * // POST /api/login
 * // {
 * //   "email": "admin@example.com",
 * //   "password": "password123"
 * // }
 * 
 * @example
 * // Success response
 * // {
 * //   "success": true,
 * //   "user": {
 * //     "email": "admin@example.com",
 * //     "role": "admin",
 * //     "firstName": "Admin"
 * //   },
 * //   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * // }
 * 
 * @example
 * // Error response (invalid credentials)
 * // {
 * //   "success": false,
 * //   "message": "Invalid credentials"
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
