import express from 'express';
import { Post } from '../models/Post.js';
import { requireAuth } from '../middleware/auth.js';

export const feedRouter = express.Router();

feedRouter.get('/', requireAuth, async (req, res) => {
  try {
    const { positivityOnly, topics, communityId } = req.query;
    const filters = {};

    const shouldFilterPositive =
      positivityOnly === 'true' || req.user.settings?.positivityFilter;
    if (shouldFilterPositive) {
      filters.positivity = 'positive';
    }

    if (communityId) {
      filters.community = communityId;
    }

    if (topics) {
      const topicList = topics
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      if (topicList.length) {
        filters.topics = { $in: topicList };
      }
    }

    const feed = await Post.find(filters)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('community', 'name slug')
      .lean();

    res.json({ feed, filtersApplied: filters });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch feed' });
  }
});

feedRouter.get('/trending', requireAuth, async (_req, res) => {
  try {
    const topicsAgg = await Post.aggregate([
      { $unwind: '$topics' },
      { $group: { _id: '$topics', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({ trendingTopics: topicsAgg.map((t) => ({ topic: t._id, count: t.count })) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch trending topics' });
  }
});
