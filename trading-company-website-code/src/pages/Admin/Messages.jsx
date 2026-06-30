import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Check } from 'lucide-react';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`/api/messages/${id}/read`, { method: 'PUT' });
      if (res.ok) {
        fetchMessages();
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
            <li><Link to="/admin/products">Products</Link></li>
            <li><Link to="/admin/messages" className="active">Messages</Link></li>
          </ul>
        </nav>
      </div>
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h2>Contact Messages</h2>
        </header>
        <main>
          <div className="recent-activity" style={{ padding: 0, overflowX: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}><Loader2 className="spinner" size={32} /></div>
            ) : messages.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--line)' }}>
                    <th style={{ padding: '16px 24px' }}>Date</th>
                    <th style={{ padding: '16px' }}>Sender</th>
                    <th style={{ padding: '16px' }}>Contact Info</th>
                    <th style={{ padding: '16px' }}>Message</th>
                    <th style={{ padding: '16px 24px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map(msg => (
                    <tr key={msg.id} style={{ borderBottom: '1px solid var(--line)' }}>
                      <td style={{ padding: '16px 24px', color: 'var(--text-light)', whiteSpace: 'nowrap' }}>
                        {new Date(msg.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px', fontWeight: 500 }}>
                        {msg.name}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div>{msg.mobile}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{msg.email || '-'}</div>
                      </td>
                      <td style={{ padding: '16px', maxWidth: '300px' }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text)' }}>
                          {msg.message}
                        </p>
                      </td>
                      <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                        {msg.status === 'Unread' ? (
                          <button onClick={() => markAsRead(msg.id)} className="btn primary" style={{ padding: '4px 8px', fontSize: '0.85rem', minHeight: '0' }}>
                            Mark Read
                          </button>
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontSize: '0.85rem', fontWeight: 500 }}>
                            <Check size={16} /> Read
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ padding: '24px', color: 'var(--text-light)', margin: 0 }}>No messages received yet.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminMessages;
