import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';

export const verificationRouter = express.Router();

function fakeRecaptchaScore(token) {
  if (!token) return 0;
  const hash = token.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return Math.min(0.99, (hash % 100) / 100);
}

verificationRouter.get('/status', requireAuth, async (req, res) => {
  const user = await User.findById(req.user._id).lean();
  res.json({
    status: user.verificationStatus,
    humanVerified: user.humanVerified,
    submissions: user.verificationSubmissions || []
  });
});

verificationRouter.post('/request', requireAuth, async (req, res) => {
  try {
    const { recaptchaToken, proofUrl, note } = req.body;

    if (!recaptchaToken) {
      return res.status(400).json({ message: 'recaptchaToken is required for verification' });
    }

    const recaptchaScore = fakeRecaptchaScore(recaptchaToken);
    const status = recaptchaScore > 0.3 ? 'pending' : 'rejected';

    const submission = {
      evidenceType: 'recaptcha',
      proofUrl,
      note,
      recaptchaScore,
      status
    };

    const user = await User.findById(req.user._id);
    user.verificationSubmissions.push(submission);
    user.verificationStatus = status === 'pending' ? 'pending' : 'rejected';
    await user.save();

    res.json({
      message: 'Verification submitted. A quick selfie or mod review may be needed.',
      status: user.verificationStatus,
      recaptchaScore
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to submit verification' });
  }
});

verificationRouter.post('/confirm', requireAuth, async (req, res) => {
  try {
    const { selfieConfirmed } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!selfieConfirmed) {
      return res.status(400).json({ message: 'selfieConfirmed flag is required for this simulated flow' });
    }

    user.humanVerified = true;
    user.verificationStatus = 'verified';
    await user.save();

    res.json({ message: 'User marked as human-verified', humanVerified: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to confirm verification' });
  }
});
