const User = require('../models/UserModel');

/**
 * Controller for user-related operations
 * @module UserController
 */

/**
 * Creates a new user in the system
 * 
 * @async
 * @function createUser
 * @param {object} req - Express request object
 * @param {object} req.body - Request body containing user data
 * @param {string} req.body.email - Email address of the user
 * @param {string} req.body.role - Role of the user (admin/distributor)
 * @param {object} res - Express response object
 * @returns {Promise<object>} JSON response with created user or error
 * 
 * @example
 * // Route implementation
 * app.post('/api/users', createUser);
 * 
 * @example
 * // Client-side request
 * fetch('/api/users', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     email: 'user@example.com',
 *     role: 'distributor'
 *   })
 * });
 */
exports.createUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    const user = await User.create({ email, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};