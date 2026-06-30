import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db, { logActivity, saveDb } from '../db.js';
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
    if (db.users.find(u => u.email === email || u.mobile_number === mobileNumber)) {
      return res.status(400).json({ error: 'Email or Mobile Number already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now(),
      full_name: fullName,
      email,
      mobile_number: mobileNumber,
      password: hashedPassword,
      role: 'Client',
      created_at: new Date().toISOString()
    };
    db.users.push(newUser);
    saveDb();
    
    logActivity(newUser.id, 'Register', 'New client registered');
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { identifier, password, rememberMe } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Identifier and password are required' });
  }

  try {
    const user = db.users.find(u => u.email === identifier || u.mobile_number === identifier);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logActivity(user.id, 'Failed Login', 'Invalid password attempt');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: rememberMe ? '7d' : '1d' }
    );

    db.sessions.push({ id: Date.now(), user_id: user.id, token, created_at: new Date().toISOString() });
    saveDb();

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
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Logout Route
router.post('/logout', requireAuth, (req, res) => {
  const token = req.cookies.jwt;
  if(token) {
     db.sessions = db.sessions.filter(s => s.token !== token);
     saveDb();
  }
  logActivity(req.user.id, 'Logout', 'User logged out');
  res.clearCookie('jwt');
  res.json({ message: 'Logout successful' });
});

// Get Profile
router.get('/profile', requireAuth, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { id, full_name, email, mobile_number, role } = user;
  res.json({ id, full_name, email, mobile_number, role });
});

// Change Password
router.put('/change-password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Required fields missing' });
  
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) return res.status(400).json({ error: 'Invalid current password' });
  
  user.password = await bcrypt.hash(newPassword, 10);
  saveDb();
  
  logActivity(user.id, 'Change Password', 'Password changed successfully');
  res.json({ message: 'Password changed successfully' });
});

export default router;
