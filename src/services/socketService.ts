import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socket: Socket | null = null;

/**
 * Connect to the Socket.IO server with JWT authentication.
 */
export function connectSocket(token: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket?.id);
  });

  socket.on('connect_error', (err) => {
    console.error('[Socket] Connection error:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  return socket;
}

/**
 * Disconnect the socket connection.
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

/**
 * Get the current socket instance.
 */
export function getSocket(): Socket | null {
  return socket;
}

/**
 * Check if socket is connected.
 */
export function isConnected(): boolean {
  return socket?.connected ?? false;
}

// ── Socket Event Constants ────────────────────────────────────────────────────
export const SOCKET_EVENTS = {
  // Outgoing (client → server)
  SEND_MESSAGE: 'send_message',
  TYPING: 'typing',
  STOP_TYPING: 'stop_typing',
  MARK_SEEN: 'mark_seen',

  // Incoming (server → client)
  RECEIVE_MESSAGE: 'receive_message',
  MESSAGE_SENT: 'message_sent',
  USER_TYPING: 'user_typing',
  USER_STOP_TYPING: 'user_stop_typing',
  MESSAGES_SEEN: 'messages_seen',
  NOTIFICATION: 'notification',
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',
  ONLINE_USERS: 'online_users',
  ERROR_MESSAGE: 'error_message',
} as const;
