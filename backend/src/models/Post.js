import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
    mediaUrl: { type: String },
    topics: { type: [String], default: [] },
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
    humanVerified: { type: Boolean, default: true },
    positivity: { type: String, enum: ['neutral', 'positive', 'needs-review'], default: 'neutral' },
    aiScanStatus: { type: String, enum: ['pending', 'clean', 'flagged'], default: 'pending' }
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ topics: 1 });

export const Post = mongoose.model('Post', postSchema);
