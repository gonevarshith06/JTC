import jwt from 'jsonwebtoken';
import db from '../db.js';

export const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    req.user = decoded;
    next();
  });
};

export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
       return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (req.user.role !== role && req.user.role !== 'Admin') { // Admin can access everything, optionally
      if (req.user.role !== role) {
         return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }
    }
    next();
  };
};
