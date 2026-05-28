const mongoose = require('mongoose');

const creatorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['food', 'fashion', 'lifestyle', 'tech', 'travel', 'fitness', 'events'],
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500,
    },
    location: {
      type: String,
      default: '',
    },
    followers: {
      type: Number,
      default: 0,
    },
    engagementRate: {
      type: Number,
      default: 0,
    },
    pricing: {
      reel: { type: Number, default: 0 },
      story: { type: Number, default: 0 },
      post: { type: Number, default: 0 },
    },
    platforms: {
      type: [String],
      enum: ['instagram', 'youtube', 'linkedin', 'twitter'],
      default: [],
    },
    profileImage: {
      type: String,
      default: '',
    },
    portfolioImages: {
      type: [String],
      default: [],
    },
    socialLinks: {
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CreatorProfile', creatorProfileSchema);
