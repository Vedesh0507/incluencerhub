const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const Notification = require('../models/Notification');

// Map of userId (string) → socketId
const onlineUsers = new Map();

/**
 * Initialize Socket.IO on the given HTTP server.
 * Returns the io instance.
 */
function initSocket(server) {
  const { Server } = require('socket.io');

  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // ── JWT Authentication Middleware ──────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      console.error('[Socket] Auth error:', error.message);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // ── Connection Handler ────────────────────────────────────────────────
  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    console.log(`[Socket] User connected: ${socket.user.name} (${userId})`);

    // Track online user
    onlineUsers.set(userId, socket.id);

    // Broadcast online status to all connected clients
    socket.broadcast.emit('user_online', { userId });

    // Send current online users list to the newly connected user
    socket.emit('online_users', { users: Array.from(onlineUsers.keys()) });

    // ── Send Message ──────────────────────────────────────────────────
    socket.on('send_message', async (data) => {
      try {
        const { receiver, text, collaboration } = data;

        if (!receiver || !text) return;

        // Create message in DB
        const message = await Message.create({
          sender: userId,
          receiver,
          text: text.trim(),
          collaboration: collaboration || null,
        });

        await message.populate('sender', 'name avatar');
        await message.populate('receiver', 'name avatar');

        // Send to receiver if online
        const receiverSocketId = onlineUsers.get(receiver);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', { message });
        }

        // Acknowledge to sender
        socket.emit('message_sent', { message });

        // Create notification for receiver
        const notification = await Notification.create({
          user: receiver,
          type: 'new_message',
          title: 'New Message',
          message: `${socket.user.name} sent you a message`,
          link: '/messages',
          relatedUser: userId,
        });

        if (receiverSocketId) {
          await notification.populate('relatedUser', 'name avatar');
          io.to(receiverSocketId).emit('notification', { notification });
        }
      } catch (error) {
        console.error('[Socket] send_message error:', error);
        socket.emit('error_message', { message: 'Failed to send message' });
      }
    });

    // ── Typing Indicators ─────────────────────────────────────────────
    socket.on('typing', (data) => {
      const { receiver } = data;
      const receiverSocketId = onlineUsers.get(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', { userId });
      }
    });

    socket.on('stop_typing', (data) => {
      const { receiver } = data;
      const receiverSocketId = onlineUsers.get(receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_stop_typing', { userId });
      }
    });

    // ── Mark Messages as Seen ─────────────────────────────────────────
    socket.on('mark_seen', async (data) => {
      try {
        const { senderId } = data;

        await Message.updateMany(
          { sender: senderId, receiver: userId, isSeen: false },
          { $set: { isSeen: true, seenAt: new Date() } }
        );

        // Notify the sender that their messages were seen
        const senderSocketId = onlineUsers.get(senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit('messages_seen', { userId });
        }
      } catch (error) {
        console.error('[Socket] mark_seen error:', error);
      }
    });

    // ── Disconnect ────────────────────────────────────────────────────
    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.user.name} (${userId})`);
      onlineUsers.delete(userId);
      socket.broadcast.emit('user_offline', { userId });
    });
  });

  return io;
}

/**
 * Get the online users map (for use in REST controllers via app.get('onlineUsers'))
 */
function getOnlineUsers() {
  return onlineUsers;
}

module.exports = { initSocket, getOnlineUsers };
