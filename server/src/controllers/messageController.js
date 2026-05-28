const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');

// ─────────────────────────────────────────────
// GET /api/messages/conversations/list
// Get list of all conversations for the logged-in user
// ─────────────────────────────────────────────
const getConversationList = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all unique users the current user has exchanged messages with
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }],
        },
      },
      // Sort messages by newest first
      { $sort: { createdAt: -1 } },
      // Group by the other user in the conversation
      {
        $group: {
          _id: {
            $cond: [{ $eq: ['$sender', userId] }, '$receiver', '$sender'],
          },
          lastMessage: { $first: '$text' },
          lastMessageAt: { $first: '$createdAt' },
          lastMessageSender: { $first: '$sender' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', userId] },
                    { $eq: ['$isSeen', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      // Sort conversations by last message time
      { $sort: { lastMessageAt: -1 } },
      // Lookup user details
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
      // Project clean output
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          lastMessageAt: 1,
          lastMessageSender: 1,
          unreadCount: 1,
          'userDetails.name': 1,
          'userDetails.email': 1,
          'userDetails.avatar': 1,
          'userDetails.role': 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error('[messageController] getConversationList error:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────────
// GET /api/messages/:userId
// Get conversation history between logged-in user and :userId
// ─────────────────────────────────────────────
const getConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const otherUserId = req.params.userId;

    // Validate other user exists
    const otherUser = await User.findById(otherUserId).select('name email avatar role');
    if (!otherUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 30));
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find({
        $or: [
          { sender: userId, receiver: otherUserId },
          { sender: otherUserId, receiver: userId },
        ],
      })
        .sort({ createdAt: -1 }) // newest first for pagination
        .skip(skip)
        .limit(limit)
        .populate('sender', 'name avatar')
        .populate('receiver', 'name avatar'),
      Message.countDocuments({
        $or: [
          { sender: userId, receiver: otherUserId },
          { sender: otherUserId, receiver: userId },
        ],
      }),
    ]);

    res.status(200).json({
      success: true,
      data: messages.reverse(), // return in chronological order
      total,
      page,
      totalPages: Math.ceil(total / limit),
      otherUser,
    });
  } catch (error) {
    console.error('[messageController] getConversation error:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────────
// POST /api/messages
// Send a new message
// ─────────────────────────────────────────────
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiver, text, collaboration } = req.body;

    if (!receiver || !text) {
      return res.status(400).json({ success: false, message: 'Receiver and text are required' });
    }

    // Prevent messaging yourself
    if (receiver === senderId.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot send a message to yourself' });
    }

    // Validate receiver exists
    const receiverUser = await User.findById(receiver).select('name');
    if (!receiverUser) {
      return res.status(404).json({ success: false, message: 'Receiver not found' });
    }

    const message = await Message.create({
      sender: senderId,
      receiver,
      text: text.trim(),
      collaboration: collaboration || null,
    });

    // Populate sender info for the response
    await message.populate('sender', 'name avatar');
    await message.populate('receiver', 'name avatar');

    // Create a notification for the receiver
    await Notification.create({
      user: receiver,
      type: 'new_message',
      title: 'New Message',
      message: `${req.user.name} sent you a message`,
      link: '/messages',
      relatedUser: senderId,
    });

    // Socket emission is handled in socketHandler.js
    // The controller returns the message so the socket handler can emit it
    const io = req.app.get('io');
    const onlineUsers = req.app.get('onlineUsers');

    if (io && onlineUsers) {
      const receiverSocketId = onlineUsers.get(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', { message });
      }

      // Also send notification via socket
      const notification = {
        type: 'new_message',
        title: 'New Message',
        message: `${req.user.name} sent you a message`,
        link: '/messages',
      };
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('notification', { notification });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    console.error('[messageController] sendMessage error:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────────
// PUT /api/messages/seen/:userId
// Mark all unseen messages from :userId as seen
// ─────────────────────────────────────────────
const markSeen = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const fromUserId = req.params.userId;

    const result = await Message.updateMany(
      {
        sender: fromUserId,
        receiver: currentUserId,
        isSeen: false,
      },
      {
        $set: { isSeen: true, seenAt: new Date() },
      }
    );

    // Emit seen status via socket
    const io = req.app.get('io');
    const onlineUsers = req.app.get('onlineUsers');

    if (io && onlineUsers) {
      const senderSocketId = onlineUsers.get(fromUserId);
      if (senderSocketId) {
        io.to(senderSocketId).emit('messages_seen', { userId: currentUserId.toString() });
      }
    }

    res.status(200).json({
      success: true,
      message: `Marked ${result.modifiedCount} messages as seen`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('[messageController] markSeen error:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

module.exports = {
  getConversationList,
  getConversation,
  sendMessage,
  markSeen,
};
