import mongoose from 'mongoose';

const verificationAttemptSchema = new mongoose.Schema(
  {
    evidenceType: { type: String, enum: ['selfie', 'id-link', 'gesture-video', 'recaptcha'], default: 'selfie' },
    proofUrl: { type: String },
    note: { type: String },
    recaptchaScore: { type: Number },
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    humanVerified: { type: Boolean, default: false },
    verificationStatus: { type: String, enum: ['unverified', 'pending', 'verified', 'rejected'], default: 'unverified' },
    premiumTier: { type: String, enum: ['free', 'premium'], default: 'free' },
    roles: { type: [String], default: ['user'] },
    verificationSubmissions: { type: [verificationAttemptSchema], default: [] },
    settings: {
      positivityFilter: { type: Boolean, default: false },
      topics: { type: [String], default: [] }
    }
  },
  { timestamps: true }
);

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

export const User = mongoose.model('User', userSchema);
