import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchMyOrders();
    }
  }, [activeTab]);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders/my-orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h3>Client Portal</h3>
        <nav>
          <ul>
            <li>
              <button 
                className={`btn btn-outline ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
                style={{ width: '100%', textAlign: 'left', marginBottom: '10px' }}
              >
                My Orders
              </button>
            </li>
            <li>
              <button 
                className={`btn btn-outline ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => setActiveTab('password')}
                style={{ width: '100%', textAlign: 'left' }}
              >
                Change Password
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h2>Welcome back, {user?.fullName}</h2>
          <button onClick={logout} className="btn btn-outline">Logout</button>
        </header>
        <main>
          
          {activeTab === 'orders' && (
            <section className="dashboard-section">
              <h3>My Orders</h3>
              {loading ? <p>Loading orders...</p> : (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr><td colSpan="4">No orders found.</td></tr>
                      ) : (
                        orders.map(order => (
                          <tr key={order.id}>
                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                            <td>{order.product}</td>
                            <td>{order.quantity}</td>
                            <td>
                              <span className={`status-badge ${order.status === 'Completed' ? 'status-completed' : 'status-pending'}`}>
                                {order.status === 'Completed' ? 'Order Placed' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {activeTab === 'password' && (
            <section className="dashboard-section" style={{ maxWidth: '500px' }}>
              <h3>Change Password</h3>
              {passwordMsg.text && (
                <div className={`alert ${passwordMsg.type === 'error' ? 'alert-error' : 'alert-success'}`}>
                  {passwordMsg.text}
                </div>
              )}
              <form onSubmit={handlePasswordChange} className="auth-form" style={{ marginTop: '20px' }}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary">Update Password</button>
              </form>
            </section>
          )}

        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
