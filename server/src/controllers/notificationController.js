const Notification = require('../models/Notification');

// ─────────────────────────────────────────────
// GET /api/notifications
// Get notifications for the logged-in user
// ─────────────────────────────────────────────
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('relatedUser', 'name avatar'),
      Notification.countDocuments({ user: userId }),
      Notification.countDocuments({ user: userId, isRead: false }),
    ]);

    res.status(200).json({
      success: true,
      data: notifications,
      total,
      unreadCount,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[notificationController] getNotifications error:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────────
// PUT /api/notifications/:id/read
// Mark a single notification as read
// ─────────────────────────────────────────────
const markRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.error('[notificationController] markRead error:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────────
// PUT /api/notifications/read-all
// Mark all notifications as read for the logged-in user
// ─────────────────────────────────────────────
const markAllRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('[notificationController] markAllRead error:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────────
// Helper: Create notification + emit via socket
// Used by other controllers (collaboration, message)
// ─────────────────────────────────────────────
const createNotification = async (data, io, onlineUsers) => {
  try {
    const notification = await Notification.create(data);
    await notification.populate('relatedUser', 'name avatar');

    // Emit via socket if user is online
    if (io && onlineUsers) {
      const recipientSocketId = onlineUsers.get(data.user.toString());
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('notification', { notification });
      }
    }

    return notification;
  } catch (error) {
    console.error('[notificationController] createNotification error:', error);
    return null;
  }
};

module.exports = {
  getNotifications,
  markRead,
  markAllRead,
  createNotification,
};
