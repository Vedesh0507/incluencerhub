const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver is required'],
    },
    collaboration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CollaborationRequest',
      default: null,
    },
    text: {
      type: String,
      required: [true, 'Message text is required'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
      trim: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    seenAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast conversation lookups
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
// Index for unread count queries
messageSchema.index({ receiver: 1, isSeen: 1 });

module.exports = mongoose.model('Message', messageSchema);
