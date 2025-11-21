import express from 'express';
import slugify from 'slugify';
import { Community } from '../models/Community.js';
import { requireAuth } from '../middleware/auth.js';

export const communitiesRouter = express.Router();

communitiesRouter.post('/', requireAuth, async (req, res) => {
  try {
    const { name, description, tags = [] } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existing = await Community.findOne({ slug });
    if (existing) {
      return res.status(409).json({ message: 'Community already exists' });
    }

    const community = await Community.create({
      name,
      slug,
      description,
      tags,
      moderators: [req.user._id],
      members: [req.user._id]
    });

    res.status(201).json({ community });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create community' });
  }
});

communitiesRouter.get('/', async (_req, res) => {
  try {
    const communities = await Community.find({}).sort({ createdAt: -1 }).limit(50).lean();
    res.json({ communities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch communities' });
  }
});

communitiesRouter.post('/:id/join', requireAuth, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    const alreadyMember = community.members.some((memberId) =>
      memberId.equals(req.user._id)
    );

    if (!alreadyMember) {
      community.members.push(req.user._id);
    }

    await community.save();
    res.json({ message: 'Joined community', communityId: community._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to join community' });
  }
});
