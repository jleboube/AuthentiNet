import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import { User } from '../models/User.js';
import { config } from '../config.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = express.Router();

function sanitizeUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    humanVerified: user.humanVerified,
    verificationStatus: user.verificationStatus,
    premiumTier: user.premiumTier,
    roles: user.roles,
    settings: user.settings
  };
}

authRouter.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: 'User with that email or username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash });

    const token = jwt.sign({ sub: user._id, roles: user.roles }, config.jwtSecret, { expiresIn: '7d' });

    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to register' });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ sub: user._id, roles: user.roles }, config.jwtSecret, { expiresIn: '7d' });
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to login' });
  }
});

authRouter.get('/me', requireAuth, async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});

authRouter.put('/settings', requireAuth, async (req, res) => {
  try {
    const { positivityFilter, topics = [] } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (typeof positivityFilter === 'boolean') {
      user.settings.positivityFilter = positivityFilter;
    }

    if (Array.isArray(topics)) {
      user.settings.topics = topics.map((t) => t.trim()).filter(Boolean);
    }

    await user.save();
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update settings' });
  }
});
