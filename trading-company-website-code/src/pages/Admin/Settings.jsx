import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminSettings = () => {
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

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h3>Admin Panel</h3>
        <nav>
          <ul>
            <li><Link to="/admin">Dashboard</Link></li>
            <li><Link to="/admin/orders">Orders</Link></li>
            <li><Link to="/admin/products">Products</Link></li>
            <li><Link to="/admin/messages">Messages</Link></li>
            <li><Link to="/admin/settings" className="active">Settings</Link></li>
          </ul>
        </nav>
      </div>
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h2>Account Settings</h2>
        </header>
        <main>
          <section className="dashboard-section" style={{ maxWidth: '500px', padding: '24px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '10px' }}>
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

export default AdminSettings;
