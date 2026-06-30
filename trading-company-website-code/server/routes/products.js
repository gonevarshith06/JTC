import express from 'express';
import db, { logActivity, saveDb } from '../db.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all products
router.get('/', (req, res) => {
  res.json(db.products);
});

// Create product (Admin only)
router.post('/', requireAuth, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Unauthorized' });
  
  const { id, name, category, type, accent, packageText, description, image } = req.body;
  
  if (db.products.find(p => p.id === id)) {
    return res.status(400).json({ error: 'Product ID already exists' });
  }

  const newProduct = { id, name, category, type, accent, packageText, description, image };
  db.products.push(newProduct);
  saveDb();
  
  logActivity(req.user.id, 'Create Product', `Product ${id} created`);
  res.status(201).json(newProduct);
});

// Update product (Admin only)
router.put('/:id', requireAuth, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Unauthorized' });
  
  const { name, category, type, accent, packageText, description, image } = req.body;
  const index = db.products.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  db.products[index] = { ...db.products[index], name, category, type, accent, packageText, description, image };
  saveDb();
  
  logActivity(req.user.id, 'Update Product', `Product ${req.params.id} updated`);
  res.json({ message: 'Product updated successfully' });
});

// Delete product (Admin only)
router.delete('/:id', requireAuth, (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Unauthorized' });
  
  const initialLength = db.products.length;
  db.products = db.products.filter(p => p.id !== req.params.id);
  
  if (db.products.length === initialLength) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  saveDb();
  logActivity(req.user.id, 'Delete Product', `Product ${req.params.id} deleted`);
  res.json({ message: 'Product deleted successfully' });
});

export default router;
