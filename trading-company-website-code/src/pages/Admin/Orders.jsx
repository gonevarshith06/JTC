import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Check, Trash2 } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markCompleted = async (id) => {
    if (!window.confirm('Mark this order as completed?')) return;
    try {
      const res = await fetch(`/api/orders/${id}/complete`, { method: 'PUT' });
      if (res.ok) {
        fetchOrders();
      } else {
        alert('Failed to update order');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchOrders();
      } else {
        alert('Failed to delete order');
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
            <li><Link to="/admin/orders" className="active">Orders</Link></li>
            <li><Link to="/admin/products">Products</Link></li>
            <li><Link to="/admin/messages">Messages</Link></li>
          </ul>
        </nav>
      </div>
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h2>Manage Orders</h2>
        </header>
        <main>
          <div className="recent-activity" style={{ padding: 0, overflowX: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}><Loader2 className="spinner" size={32} /></div>
            ) : orders.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--line)' }}>
                    <th style={{ padding: '16px 24px' }}>Date</th>
                    <th style={{ padding: '16px' }}>Shop/Owner</th>
                    <th style={{ padding: '16px' }}>Order Details</th>
                    <th style={{ padding: '16px' }}>Status</th>
                    <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td style={{ padding: '16px 24px', color: 'var(--text-light)', whiteSpace: 'nowrap' }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 500 }}>{order.shopName}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text)', marginTop: '4px' }}>
                          <strong>Owner:</strong> {order.ownerName}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                          <strong>Phone:</strong> {order.mobile}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text)' }}>
                          <strong>Email:</strong> {order.email}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text)', marginTop: '4px' }}>
                          <strong>Address:</strong> <br/>
                          <span style={{ color: 'var(--text-light)' }}>{order.address}</span>
                        </div>
                        {order.message && (
                          <div style={{ fontSize: '0.85rem', color: 'var(--text)', marginTop: '4px' }}>
                            <strong>Message:</strong> <br/>
                            <span style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>{order.message}</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 500 }}>{order.product}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Qty: {order.quantity}</div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ 
                          padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 500,
                          background: order.status === 'Pending' ? '#fef3c7' : '#dcfce3',
                          color: order.status === 'Pending' ? '#92400e' : '#166534'
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {order.status === 'Pending' && (
                          <button 
                            onClick={() => markCompleted(order.id)} 
                            className="btn primary" 
                            style={{ padding: '6px 10px', fontSize: '0.85rem', minHeight: '0', marginRight: '8px' }}
                            title="Mark Completed"
                          >
                            <Check size={16} /> Complete
                          </button>
                        )}
                        <button 
                          onClick={() => deleteOrder(order.id)} 
                          className="btn-icon" 
                          style={{ color: '#dc2626', cursor: 'pointer', background: 'none', border: 'none', verticalAlign: 'middle' }}
                          title="Delete Order"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ padding: '24px', color: 'var(--text-light)', margin: 0 }}>No orders found.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminOrders;
