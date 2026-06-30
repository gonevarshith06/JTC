import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db, { logActivity } from '../db.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Register Route
router.post('/register', async (req, res) => {
  const { fullName, email, mobileNumber, password } = req.body;

  if (!fullName || !email || !mobileNumber || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (full_name, email, mobile_number, password, role) VALUES (?, ?, ?, ?, ?)',
      [fullName, email, mobileNumber, hashedPassword, 'Client'],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Email or Mobile Number already exists' });
          }
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        logActivity(this.lastID, 'Register', 'New client registered');
        res.status(201).json({ message: 'Registration successful' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login Route
router.post('/login', (req, res) => {
  const { identifier, password, rememberMe } = req.body; // identifier can be email or username(mobile)

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Identifier and password are required' });
  }

  db.get(
    'SELECT * FROM users WHERE email = ? OR mobile_number = ?',
    [identifier, identifier],
    async (err, user) => {
      if (err) {
         return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        logActivity(user.id, 'Failed Login', 'Invalid password attempt');
        // TODO: Rate limiting / lockout logic here for failed attempts
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        JWT_SECRET,
        { expiresIn: rememberMe ? '7d' : '1d' } // Session timeout after 1 day or 7 days
      );

      db.run('INSERT INTO sessions (user_id, token) VALUES (?, ?)', [user.id, token]);
      logActivity(user.id, 'Login', 'User logged in successfully');

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
        sameSite: 'strict',
      });

      res.json({
        message: 'Login successful',
        user: { id: user.id, fullName: user.full_name, email: user.email, role: user.role }
      });
    }
  );
});

// Logout Route
router.post('/logout', requireAuth, (req, res) => {
  const token = req.cookies.jwt;
  if(token) {
     db.run('DELETE FROM sessions WHERE token = ?', [token]);
  }
  logActivity(req.user.id, 'Logout', 'User logged out');
  res.clearCookie('jwt');
  res.json({ message: 'Logout successful' });
});

// Get Profile
router.get('/profile', requireAuth, (req, res) => {
  db.get('SELECT id, full_name, email, mobile_number, role FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });
});

export default router;
