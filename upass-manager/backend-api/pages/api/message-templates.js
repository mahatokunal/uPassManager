// backend-api/pages/api/message-templates.js
import pool, { executeQuery } from '../../db';
import { verifyToken } from '../../../backend-common/auth';

/**
 * API handler for managing message templates
 * 
 * This endpoint supports CRUD operations for email message templates.
 * It allows listing, creating, updating, and deleting templates that
 * can be used for sending notifications to students.
 * 
 * @async
 * @function handler
 * @param {object} req - The HTTP request object
 * @param {string} req.method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} [req.body] - Request body (for POST and PUT requests)
 * @param {string} [req.body.title] - Template title (for POST and PUT)
 * @param {string} [req.body.message] - Template message content (for POST and PUT)
 * @param {number} [req.body.id] - Template ID (for PUT)
 * @param {object} [req.query] - Query parameters
 * @param {number} [req.query.id] - Template ID (for DELETE)
 * @param {object} res - The HTTP response object
 * @returns {Promise<object>} JSON response with success or error message
 * 
 * @example
 * // GET Request: /api/message-templates
 * // Response:
 * // {
 * //   "templates": [
 * //     {
 * //       "id": 1,
 * //       "title": "Welcome to U-Pass",
 * //       "message": "Welcome to the U-Pass program!",
 * //       "created_at": "2025-05-01T14:30:45.000Z",
 * //       "updated_at": "2025-05-01T14:30:45.000Z"
 * //     },
 * //     ...
 * //   ]
 * // }
 * 
 * @example
 * // POST Request: /api/message-templates
 * // {
 * //   "title": "New Template",
 * //   "message": "This is a new template for notifications."
 * // }
 * // Response:
 * // {
 * //   "message": "Template created successfully",
 * //   "template": {
 * //     "id": 2,
 * //     "title": "New Template",
 * //     "message": "This is a new template for notifications.",
 * //     "created_at": "2025-05-01T14:30:45.000Z",
 * //     "updated_at": "2025-05-01T14:30:45.000Z"
 * //   }
 * // }
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
 * Fetch all message templates from the database
 * 
 * @async
 * @function getTemplates
 * @param {object} req - The HTTP request object
 * @param {object} res - The HTTP response object
 * @returns {Promise<object>} JSON response with a list of templates
 * 
 * @example
 * // GET Request: /api/message-templates
 * // Response:
 * // {
 * //   "templates": [
 * //     {
 * //       "id": 1,
 * //       "title": "Welcome to U-Pass",
 * //       "message": "Welcome to the U-Pass program!",
 * //       "created_at": "2025-05-01T14:30:45.000Z",
 * //       "updated_at": "2025-05-01T14:30:45.000Z"
 * //     },
 * //     ...
 * //   ]
 * // }
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
 * Create a new message template
 * 
 * @async
 * @function createTemplate
 * @param {object} req - The HTTP request object
 * @param {object} req.body - Request body containing title and message
 * @param {string} req.body.title - Template title
 * @param {string} req.body.message - Template message content
 * @param {object} res - The HTTP response object
 * @returns {Promise<object>} JSON response with the created template
 * 
 * @example
 * // POST Request: /api/message-templates
 * // {
 * //   "title": "New Template",
 * //   "message": "This is a new template for notifications."
 * // }
 * // Response:
 * // {
 * //   "message": "Template created successfully",
 * //   "template": {
 * //     "id": 2,
 * //     "title": "New Template",
 * //     "message": "This is a new template for notifications.",
 * //     "created_at": "2025-05-01T14:30:45.000Z",
 * //     "updated_at": "2025-05-01T14:30:45.000Z"
 * //   }
 * // }
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
 * Update an existing message template
 * 
 * @async
 * @function updateTemplate
 * @param {object} req - The HTTP request object
 * @param {object} req.body - Request body containing id, title, and message
 * @param {number} req.body.id - Template ID
 * @param {string} req.body.title - Template title
 * @param {string} req.body.message - Template message content
 * @param {object} res - The HTTP response object
 * @returns {Promise<object>} JSON response with the updated template
 * 
 * @example
 * // PUT Request: /api/message-templates
 * // {
 * //   "id": 1,
 * //   "title": "Updated Template",
 * //   "message": "This is an updated template for notifications."
 * // }
 * // Response:
 * // {
 * //   "message": "Template updated successfully",
 * //   "template": {
 * //     "id": 1,
 * //     "title": "Updated Template",
 * //     "message": "This is an updated template for notifications.",
 * //     "created_at": "2025-05-01T14:30:45.000Z",
 * //     "updated_at": "2025-05-01T14:30:45.000Z"
 * //   }
 * // }
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
 * Delete a message template
 * 
 * @async
 * @function deleteTemplate
 * @param {object} req - The HTTP request object
 * @param {object} req.query - Query parameters containing template ID
 * @param {number} req.query.id - Template ID
 * @param {object} res - The HTTP response object
 * @returns {Promise<object>} JSON response with success or error message
 * 
 * @example
 * // DELETE Request: /api/message-templates?id=1
 * // Response:
 * // {
 * //   "message": "Template deleted successfully",
 * //   "id": 1
 * // }
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
