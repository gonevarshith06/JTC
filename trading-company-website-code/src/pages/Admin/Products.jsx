import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit2, Trash2, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    id: '', name: '', category: 'Edible Oils', type: 'oil', 
    accent: '#000000', packageText: '', description: '', image: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    setError('');
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        id: '', name: '', category: 'Edible Oils', type: 'oil', 
        accent: '#e8b423', packageText: '', description: '', image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await fetchProducts();
        handleCloseModal();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save product');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h3>Admin Panel</h3>
        <nav>
          <ul>
            <li><Link to="/admin">Dashboard</Link></li>
            <li><Link to="/admin/orders">Orders</Link></li>
            <li><Link to="/admin/products" className="active">Products</Link></li>
            <li><Link to="/admin/messages">Messages</Link></li>
          </ul>
        </nav>
      </div>
      <div className="dashboard-content">
        <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2>Manage Products</h2>
          <button onClick={() => handleOpenModal()} className="btn primary" style={{ width: 'auto' }}>
            <Plus size={18} style={{ marginRight: '8px' }} /> Add Product
          </button>
        </header>
        <main>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}><Loader2 className="spinner" size={32} /></div>
          ) : (
            <div className="recent-activity" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--line)' }}>
                    <th style={{ padding: '16px' }}>Image</th>
                    <th style={{ padding: '16px' }}>Name</th>
                    <th style={{ padding: '16px' }}>Category</th>
                    <th style={{ padding: '16px' }}>Type</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td style={{ padding: '16px' }}>
                        {product.image ? (
                          <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                        ) : (
                          <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '4px' }}></div>
                        )}
                      </td>
                      <td style={{ padding: '16px', fontWeight: '500' }}>{product.name}</td>
                      <td style={{ padding: '16px' }}>{product.category}</td>
                      <td style={{ padding: '16px' }}>{product.type}</td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button onClick={() => handleOpenModal(product)} className="btn-icon" style={{ marginRight: '10px', color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none' }}>
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="btn-icon" style={{ color: '#dc2626', cursor: 'pointer', background: 'none', border: 'none' }}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-light)' }}>
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="auth-card" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Product ID (slug)</label>
                  <input name="id" value={formData.id} onChange={handleChange} required disabled={!!editingProduct} placeholder="e.g. sunflower-oil" />
                </div>
                <div className="form-group">
                  <label>Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--line)', borderRadius: '6px' }}>
                    <option>Edible Oils</option>
                    <option>Dal & Pulses</option>
                    <option>Rice</option>
                    <option>Spices</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <input name="type" value={formData.type} onChange={handleChange} required placeholder="e.g. oil, pulse" />
                </div>
                <div className="form-group">
                  <label>Accent Color (Hex)</label>
                  <input type="color" name="accent" value={formData.accent} onChange={handleChange} style={{ height: '44px', padding: '4px' }} />
                </div>
                <div className="form-group">
                  <label>Package Text</label>
                  <input name="packageText" value={formData.packageText} onChange={handleChange} />
                </div>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} style={{ width: '100%', padding: '12px', border: '1px solid var(--line)', borderRadius: '6px', minHeight: '80px' }} />
              </div>
              
              <div className="form-group">
                <label>Image URL</label>
                <input name="image" value={formData.image} onChange={handleChange} />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <button type="button" onClick={handleCloseModal} className="btn" style={{ flex: 1, background: '#e2e8f0', color: '#0f172a' }}>Cancel</button>
                <button type="submit" className="btn primary" style={{ flex: 2 }} disabled={submitting}>
                  {submitting ? <Loader2 className="spinner" size={18} /> : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
