// common/auth.js
import pool from '../backend-api/db.js';  // Import your DB connection from backend-api
import jwt from 'jsonwebtoken';

/**
 * Authenticate a user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - An object with either { user } on success or { error } on failure.
 */
export async function authenticateUser(email, password) {
  try {
    console.log("email = ", email);
    // Query the database for a user with the given email.
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      // If no user is found, return an error.
      return { error: 'Username not found' };
    }

    const user = rows[0];

    // For demo purposes, we compare plain text passwords.
    // In production, store hashed passwords and use a library (e.g., bcrypt) to compare.
    if (user.password !== password) {
      return { error: 'Wrong password' };
    }

    // Successful authentication.
    return { user };
  } catch (err) {
    console.error('Authentication error:', err);
    return { error: 'Internal server error' };
  }
}

// /**
//  * Generate a JWT token for an authenticated user.
//  * @param {Object} user - The authenticated user object.
//  * @returns {string} - The JWT token.
//  */
// export function generateToken(user) {
//   return jwt.sign(
//     { uuid: user.UUID, email: user.email, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: '1h' }
//   );
// }
