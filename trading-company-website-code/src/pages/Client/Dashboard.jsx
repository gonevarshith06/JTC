import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h3>Client Portal</h3>
        <nav>
          <ul>
            <li><Link to="/client">Dashboard</Link></li>
            <li><Link to="/client/appointments">My Appointments</Link></li>
            <li><Link to="/client/profile">My Profile</Link></li>
            <li><Link to="/client/documents">Documents</Link></li>
          </ul>
        </nav>
      </div>
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h2>Welcome back, {user?.fullName}</h2>
          <button onClick={logout} className="btn btn-outline">Logout</button>
        </header>
        <main>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Upcoming Appointments</h4>
              <p>1</p>
            </div>
            <div className="stat-card">
              <h4>Pending Documents</h4>
              <p>0</p>
            </div>
          </div>
          <section className="recent-activity">
             <h3>Book a New Appointment</h3>
             <button className="btn btn-primary">Book Now</button>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
