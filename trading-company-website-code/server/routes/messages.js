import express from 'express';
import db from '../db.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all messages (Admin only)
router.get('/', requireAuth, requireRole('Admin'), (req, res) => {
  db.all('SELECT * FROM messages ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve messages' });
    }
    res.json(rows);
  });
});

// Create a new message (Public)
router.post('/', (req, res) => {
  const { name, mobile, email, message } = req.body;
  
  if (!name || !mobile || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const stmt = db.prepare('INSERT INTO messages (name, mobile, email, message) VALUES (?, ?, ?, ?)');
  stmt.run(name, mobile, email, message, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to submit message' });
    }
    res.status(201).json({ message: 'Message submitted successfully' });
  });
  stmt.finalize();
});

// Mark message as read (Admin only) - Optional but good feature
router.put('/:id/read', requireAuth, requireRole('Admin'), (req, res) => {
  db.run('UPDATE messages SET status = ? WHERE id = ?', ['Read', req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update message' });
    }
    res.json({ success: true });
  });
});

export default router;
