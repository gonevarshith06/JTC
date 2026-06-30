import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setPasswordMsg({ type: 'error', text: 'New passwords do not match' });
    }
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg({ type: 'success', text: data.message });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordMsg({ type: 'error', text: data.error || 'Failed to change password' });
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: 'Failed to connect to server' });
    }
  };

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

          <section className="dashboard-section" style={{ maxWidth: '500px', marginTop: '40px', padding: '24px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px' }}>
            <h3 style={{ marginBottom: '16px' }}>Change Password</h3>
            {passwordMsg.text && (
              <div className={`alert ${passwordMsg.type === 'error' ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '16px', padding: '12px', borderRadius: '6px', background: passwordMsg.type === 'error' ? '#fee2e2' : '#dcfce3', color: passwordMsg.type === 'error' ? '#dc2626' : '#166534' }}>
                {passwordMsg.text}
              </div>
            )}
            <form onSubmit={handlePasswordChange} className="auth-form">
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Current Password</label>
                <input 
                  type="password" 
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  required 
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  required 
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  required 
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--line)', borderRadius: '6px' }}
                />
              </div>
              <button type="submit" className="btn primary" style={{ background: 'var(--green-700)', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                Update Password
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
