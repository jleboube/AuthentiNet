import express from 'express';
import { Post } from '../models/Post.js';
import { requireAuth, requireVerified } from '../middleware/auth.js';

export const postsRouter = express.Router();

postsRouter.post('/', requireAuth, requireVerified, async (req, res) => {
  try {
    const { content, topics = [], communityId, mediaUrl, positivity } = req.body;

    if (!content || content.trim().length < 3) {
      return res.status(400).json({ message: 'Content must be at least 3 characters' });
    }

    const post = await Post.create({
      author: req.user._id,
      content: content.trim(),
      topics,
      community: communityId,
      mediaUrl,
      positivity: positivity || 'neutral',
      humanVerified: true,
      aiScanStatus: 'pending'
    });

    res.status(201).json({ post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

postsRouter.get('/', requireAuth, async (req, res) => {
  try {
    const { author, topic } = req.query;

    const filters = {};
    if (author) filters.author = author;
    if (topic) filters.topics = topic;

    const posts = await Post.find(filters)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});
