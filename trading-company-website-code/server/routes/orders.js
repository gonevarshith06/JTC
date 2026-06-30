import express from 'express';
import db, { logActivity, saveDb } from '../db.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all orders (Admin only)
router.get('/', requireAuth, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Unauthorized' });
  // sort by created_at desc
  const sortedOrders = [...db.orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(sortedOrders);
});

// Get my orders (Client)
router.get('/my-orders', requireAuth, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const myOrders = db.orders.filter(o => 
    (o.email && o.email === user.email) || 
    (o.mobile && o.mobile === user.mobile_number)
  ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  res.json(myOrders);
});

// Create new order (Public/Client)
router.post('/', (req, res) => {
  const { ownerName, shopName, mobile, email, address, product, quantity, message } = req.body;
  
  if (!ownerName || !shopName || !mobile || !email || !address || !product || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newOrder = {
    id: Date.now(),
    ownerName, shopName, mobile, email, address, product, quantity, message: message || '',
    status: 'Pending',
    created_at: new Date().toISOString()
  };
  
  db.orders.push(newOrder);
  saveDb();
  
  res.status(201).json({ message: 'Order submitted successfully', orderId: newOrder.id });
});

// Update order status (Admin only)
router.put('/:id/complete', requireAuth, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Unauthorized' });
  
  const order = db.orders.find(o => o.id === parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = 'Completed';
  saveDb();
  
  logActivity(req.user.id, 'Complete Order', `Order ${req.params.id} marked as completed`);
  res.json({ message: 'Order marked as completed' });
});

// Delete order (Admin only)
router.delete('/:id', requireAuth, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Unauthorized' });
  
  const initialLength = db.orders.length;
  db.orders = db.orders.filter(o => o.id !== parseInt(req.params.id));
  
  if (db.orders.length === initialLength) {
    return res.status(404).json({ error: 'Order not found' });
  }

  saveDb();
  logActivity(req.user.id, 'Delete Order', `Order ${req.params.id} deleted`);
  res.json({ message: 'Order deleted successfully' });
});

export default router;
