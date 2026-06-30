import express from 'express';
import db from '../db.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all orders (Admin only)
router.get('/', requireAuth, requireRole('Admin'), (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve orders' });
    }
    res.json(rows);
  });
});

// Create a new order (Public)
router.post('/', (req, res) => {
  const { ownerName, shopName, mobile, email, address, product, quantity, message } = req.body;
  
  if (!ownerName || !shopName || !mobile || !email || !address || !product || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const stmt = db.prepare('INSERT INTO orders (ownerName, shopName, mobile, email, address, product, quantity, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  stmt.run(ownerName, shopName, mobile, email, address, product, quantity, message, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to submit order' });
    }
    res.status(201).json({ message: 'Order submitted successfully', orderId: this.lastID });
  });
  stmt.finalize();
});

// Mark order as completed (Admin only)
router.put('/:id/complete', requireAuth, requireRole('Admin'), (req, res) => {
  db.run('UPDATE orders SET status = ? WHERE id = ?', ['Completed', req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update order' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, message: 'Order marked as completed' });
  });
});

// Delete an order (Admin only)
router.delete('/:id', requireAuth, requireRole('Admin'), (req, res) => {
  db.run('DELETE FROM orders WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete order' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ success: true, message: 'Order deleted successfully' });
  });
});

export default router;
