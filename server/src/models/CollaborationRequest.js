const mongoose = require('mongoose');

const collaborationRequestSchema = new mongoose.Schema(
  {
    businessUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Business user is required'],
    },
    creatorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CreatorProfile',
      required: [true, 'Creator profile is required'],
    },
    campaignTitle: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true,
      maxlength: [100, 'Campaign title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget cannot be negative'],
    },
    barter: {
      type: Boolean,
      default: false,
    },
    deliverables: {
      type: [String],
      default: [],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    platform: {
      type: String,
      required: [true, 'Platform is required'],
      enum: ['instagram', 'youtube', 'linkedin', 'twitter', 'other'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CollaborationRequest', collaborationRequestSchema);
