import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', {
          headers: { 'Authorization': `Bearer ${document.cookie}` } // Handled by cookie-parser in reality, but good practice
        });
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
    fetchOrders();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h3>Admin Panel</h3>
        <nav>
          <ul>
            <li><Link to="/admin" className="active">Dashboard</Link></li>
            <li><Link to="/admin/orders">Orders</Link></li>
            <li><Link to="/admin/products">Products</Link></li>
            <li><Link to="/admin/messages">Messages</Link></li>
          </ul>
        </nav>
      </div>
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h2>Welcome, {user?.fullName}</h2>
          <button onClick={logout} className="btn btn-outline">Logout</button>
        </header>
        <main>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Orders</h4>
              <p>{loading ? '-' : orders.length}</p>
            </div>
            <div className="stat-card">
              <h4>Pending Actions</h4>
              <p>{loading ? '-' : orders.filter(o => o.status === 'Pending').length}</p>
            </div>
          </div>
          <section className="recent-activity" style={{ padding: 0, overflowX: 'auto' }}>
            <h3 style={{ padding: '24px 24px 16px' }}>Recent Orders</h3>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}><Loader2 className="spinner" size={32} /></div>
            ) : orders.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--line)' }}>
                    <th style={{ padding: '16px 24px' }}>Date</th>
                    <th style={{ padding: '16px' }}>Shop/Owner</th>
                    <th style={{ padding: '16px' }}>Product</th>
                    <th style={{ padding: '16px' }}>Qty</th>
                    <th style={{ padding: '16px 24px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td style={{ padding: '16px 24px', color: 'var(--text-light)' }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 500 }}>{order.shopName}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{order.ownerName} • {order.mobile}</div>
                      </td>
                      <td style={{ padding: '16px' }}>{order.product}</td>
                      <td style={{ padding: '16px' }}>{order.quantity}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ 
                          padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 500,
                          background: order.status === 'Pending' ? '#fef3c7' : '#dcfce3',
                          color: order.status === 'Pending' ? '#92400e' : '#166534'
                        }}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ padding: '0 24px 24px', color: 'var(--text-light)' }}>No recent activity.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
