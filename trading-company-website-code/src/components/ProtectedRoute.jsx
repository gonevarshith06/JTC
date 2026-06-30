import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!user) {
    // Redirect them to the login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'Admin') {
    // If not authorized, redirect to home or their own dashboard
    const redirectPath = user.role === 'Admin' ? '/admin' : '/client';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
