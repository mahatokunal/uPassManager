// backend-api/pages/api/send-notification.js
import pool from '../../db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { recipients, message } = req.body;
  
  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ message: 'Recipients are required and must be an array' });
  }

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ message: 'Message is required and cannot be empty' });
  }
  
  try {
    // In a real application, this would send emails or other notifications
    // For this demo, we'll just log the notifications and return success
    
    console.log('Sending notifications:');
    console.log('Message:', message);
    console.log('Recipients:', recipients);
    
    // Simulate a database operation to record the notifications
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    // For each recipient, record the notification in the database
    // In a real app, you might have a notifications table
    // Here we're just simulating the operation
    const successCount = recipients.length;
    
    return res.status(200).json({
      message: 'Notifications sent successfully',
      success: true,
      sent: successCount,
      total: recipients.length,
      timestamp
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
}
