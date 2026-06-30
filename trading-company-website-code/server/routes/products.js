import express from 'express';
import db from '../db.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all products (Public)
router.get('/', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve products' });
    }
    res.json(rows);
  });
});

// Create a new product (Admin only)
router.post('/', requireAuth, requireRole('Admin'), (req, res) => {
  const { id, name, category, type, accent, packageText, description, image } = req.body;
  
  if (!id || !name || !category || !type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const stmt = db.prepare('INSERT INTO products (id, name, category, type, accent, packageText, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  stmt.run(id, name, category, type, accent, packageText, description, image, function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Product ID already exists' });
      }
      return res.status(500).json({ error: 'Failed to create product' });
    }
    res.status(201).json({ message: 'Product created successfully', productId: id });
  });
  stmt.finalize();
});

// Update a product (Admin only)
router.put('/:id', requireAuth, requireRole('Admin'), (req, res) => {
  const { name, category, type, accent, packageText, description, image } = req.body;
  
  const stmt = db.prepare('UPDATE products SET name = ?, category = ?, type = ?, accent = ?, packageText = ?, description = ?, image = ? WHERE id = ?');
  stmt.run(name, category, type, accent, packageText, description, image, req.params.id, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to update product' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully' });
  });
  stmt.finalize();
});

// Delete a product (Admin only)
router.delete('/:id', requireAuth, requireRole('Admin'), (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete product' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

export default router;
