/**
 * @file API endpoint for managing message templates
 * @description Handles CRUD operations for message templates used in notifications
 * @module backend-api/pages/api/message-templates
 */
import pool, { executeQuery } from '../../db';
import { verifyToken } from '../../../backend-common/auth';

/**
 * Main handler for message templates API that routes to appropriate function based on HTTP method
 * 
 * @async
 * @function handler
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 * @returns {Object} JSON response based on the requested operation
 */
export default async function handler(req, res) {
  // Verify the authentication token - temporarily allow all authenticated users
  try {
    // Get userRole from cookies or headers
    let userRole = null;
    
    // Check for cookies
    if (req.headers.cookie) {
      const cookies = {};
      req.headers.cookie.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        const name = parts[0].trim();
        const value = parts[1] || '';
        cookies[name] = decodeURIComponent(value.trim());
      });
      
      userRole = cookies.userRole;
    }
    
    // If no role in cookies, check headers
    if (!userRole && req.headers.authorization) {
      userRole = req.headers.authorization;
    }
    
    // For development, allow all authenticated requests
    // In production, you would check if user.role === 'admin'
    if (!userRole) {
      console.log('No userRole found in request');
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    console.log('User authenticated with role:', userRole);
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Route based on HTTP method
  switch (req.method) {
    case 'GET':
      return getTemplates(req, res);
    case 'POST':
      return createTemplate(req, res);
    case 'PUT':
      return updateTemplate(req, res);
    case 'DELETE':
      return deleteTemplate(req, res);
    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}

/**
 * Retrieves all message templates from the database
 * 
 * @async
 * @function getTemplates
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 * @returns {Object} JSON response containing all templates
 * 
 * @example
 * // Success response (200 OK)
 * {
 *   "templates": [
 *     {
 *       "id": 1,
 *       "title": "Welcome Message",
 *       "message": "Welcome to UPass program! Your card is ready for pickup.",
 *       "created_at": "2025-01-01T12:00:00Z",
 *       "updated_at": "2025-01-01T12:00:00Z"
 *     }
 *   ]
 * }
 */
async function getTemplates(req, res) {
  try {
    const templates = await executeQuery(
      'SELECT * FROM message_templates ORDER BY created_at DESC'
    );
    return res.status(200).json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Creates a new message template
 * 
 * @async
 * @function createTemplate
 * @param {Object} req - The HTTP request object
 * @param {Object} req.body - The request body
 * @param {string} req.body.title - Template title
 * @param {string} req.body.message - Template message content
 * @param {Object} res - The HTTP response object
 * @returns {Object} JSON response indicating success and the created template
 * 
 * @example
 * // Request body
 * {
 *   "title": "Pickup Reminder",
 *   "message": "This is a reminder to pick up your UPass card."
 * }
 * 
 * // Success response (201 Created)
 * {
 *   "message": "Template created successfully",
 *   "template": {
 *     "id": 2,
 *     "title": "Pickup Reminder",
 *     "message": "This is a reminder to pick up your UPass card.",
 *     "created_at": "2025-05-04T14:30:00Z",
 *     "updated_at": "2025-05-04T14:30:00Z"
 *   }
 * }
 */
async function createTemplate(req, res) {
  const { title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({ message: 'Title and message are required' });
  }

  try {
    const result = await executeQuery(
      'INSERT INTO message_templates (title, message, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
      [title, message]
    );
    
    const newTemplate = await executeQuery(
      'SELECT * FROM message_templates WHERE id = ?',
      [result.insertId]
    );
    
    return res.status(201).json({ 
      message: 'Template created successfully', 
      template: newTemplate[0] 
    });
  } catch (error) {
    console.error('Error creating template:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Updates an existing message template
 * 
 * @async
 * @function updateTemplate
 * @param {Object} req - The HTTP request object
 * @param {Object} req.body - The request body
 * @param {number} req.body.id - Template ID to update
 * @param {string} req.body.title - New template title
 * @param {string} req.body.message - New template message content
 * @param {Object} res - The HTTP response object
 * @returns {Object} JSON response indicating success and the updated template
 * 
 * @example
 * // Request body
 * {
 *   "id": 2,
 *   "title": "Updated Pickup Reminder",
 *   "message": "This is an updated reminder to pick up your UPass card."
 * }
 * 
 * // Success response (200 OK)
 * {
 *   "message": "Template updated successfully",
 *   "template": {
 *     "id": 2,
 *     "title": "Updated Pickup Reminder",
 *     "message": "This is an updated reminder to pick up your UPass card.",
 *     "created_at": "2025-05-04T14:30:00Z",
 *     "updated_at": "2025-05-04T15:45:00Z"
 *   }
 * }
 */
async function updateTemplate(req, res) {
  const { id, title, message } = req.body;

  if (!id || !title || !message) {
    return res.status(400).json({ message: 'ID, title, and message are required' });
  }

  try {
    const result = await executeQuery(
      'UPDATE message_templates SET title = ?, message = ?, updated_at = NOW() WHERE id = ?',
      [title, message, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    const updatedTemplate = await executeQuery(
      'SELECT * FROM message_templates WHERE id = ?',
      [id]
    );
    
    return res.status(200).json({ 
      message: 'Template updated successfully', 
      template: updatedTemplate[0] 
    });
  } catch (error) {
    console.error('Error updating template:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Deletes a message template
 * 
 * @async
 * @function deleteTemplate
 * @param {Object} req - The HTTP request object
 * @param {Object} req.query - The query parameters
 * @param {number} req.query.id - Template ID to delete
 * @param {Object} res - The HTTP response object
 * @returns {Object} JSON response indicating success and the deleted template ID
 * 
 * @example
 * // Request query: ?id=2
 * 
 * // Success response (200 OK)
 * {
 *   "message": "Template deleted successfully",
 *   "id": "2"
 * }
 */
async function deleteTemplate(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Template ID is required' });
  }

  try {
    const result = await executeQuery(
      'DELETE FROM message_templates WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }
    
    return res.status(200).json({ 
      message: 'Template deleted successfully',
      id: id
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
