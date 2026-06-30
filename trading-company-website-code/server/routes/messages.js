import express from 'express';
import db, { logActivity, saveDb } from '../db.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all messages (Admin only)
router.get('/', requireAuth, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Unauthorized' });
  res.json(db.messages);
});

// Submit a new message (Public)
router.post('/', (req, res) => {
  const { name, mobile, email, message } = req.body;
  
  if (!name || !mobile || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newMessage = {
    id: Date.now(),
    name, mobile, email: email || '', message,
    status: 'Unread',
    created_at: new Date().toISOString()
  };
  
  db.messages.push(newMessage);
  saveDb();
  
  res.status(201).json({ message: 'Message sent successfully', messageId: newMessage.id });
});

// Mark message as read (Admin only)
router.put('/:id/read', requireAuth, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Unauthorized' });
  
  const msg = db.messages.find(m => m.id === parseInt(req.params.id));
  if (!msg) return res.status(404).json({ error: 'Message not found' });

  msg.status = 'Read';
  saveDb();
  
  logActivity(req.user.id, 'Read Message', `Message ${req.params.id} marked as read`);
  res.json({ message: 'Message marked as read' });
});

export default router;
