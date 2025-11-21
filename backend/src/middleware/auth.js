import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { User } from '../models/User.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ')
      ? header.replace('Bearer ', '')
      : null;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.sub).lean();

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireVerified(req, res, next) {
  if (!req.user?.humanVerified) {
    return res
      .status(403)
      .json({ message: 'Human verification required to perform this action' });
  }
  next();
}
