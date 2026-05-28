"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { EmptyChatState } from "@/components/chat/EmptyChatState";
import {
  getConversationList,
  getConversation,
  sendMessage as sendMessageAPI,
  markMessagesSeen,
} from "@/services/messageService";
import type { ConversationItem, Message } from "@/services/messageService";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  SOCKET_EVENTS,
} from "@/services/socketService";

export default function MessagesPage() {
  const router = useRouter();

  // Auth state
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Conversation state
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [convLoading, setConvLoading] = useState(true);

  // Active chat state
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<{
    _id: string;
    name: string;
    avatar?: string;
    role?: string;
  } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgPage, setMsgPage] = useState(1);
  const [msgTotalPages, setMsgTotalPages] = useState(1);

  // Real-time state
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  // Mobile responsive
  const [showSidebar, setShowSidebar] = useState(true);

  // Ref for current active user to avoid stale closures in socket handlers
  const activeUserIdRef = useRef<string | null>(null);
  activeUserIdRef.current = activeUserId;

  // ── Auth Check ───────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.push("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setCurrentUserId(user.id);
      setIsAuthenticated(true);
    } catch {
      router.push("/auth/login");
    }
  }, [router]);

  // ── Load Conversations ───────────────────────────────────────────────
  const loadConversations = useCallback(async () => {
    setConvLoading(true);
    const result = await getConversationList();
    if (result.success && result.data) {
      setConversations(result.data);
    }
    setConvLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated, loadConversations]);

  // ── Socket Connection ────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = connectSocket(token);

    // Online users
    socket.on(SOCKET_EVENTS.ONLINE_USERS, (data: { users: string[] }) => {
      setOnlineUsers(new Set(data.users));
    });

    socket.on(SOCKET_EVENTS.USER_ONLINE, (data: { userId: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.add(data.userId);
        return next;
      });
    });

    socket.on(SOCKET_EVENTS.USER_OFFLINE, (data: { userId: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(data.userId);
        return next;
      });
    });

    // Receive message
    socket.on(
      SOCKET_EVENTS.RECEIVE_MESSAGE,
      (data: { message: Message }) => {
        const msg = data.message;
        const senderId = msg.sender._id;

        // If this message is from the currently active conversation, add it
        if (activeUserIdRef.current === senderId) {
          setMessages((prev) => [...prev, msg]);
          // Mark as seen immediately since user is looking at the conversation
          markMessagesSeen(senderId);
          socket.emit(SOCKET_EVENTS.MARK_SEEN, { senderId });
        }

        // Update conversation list
        loadConversations();
      }
    );

    // Message sent acknowledgment
    socket.on(
      SOCKET_EVENTS.MESSAGE_SENT,
      (data: { message: Message }) => {
        // Update message in the list if needed
      }
    );

    // Typing indicators
    socket.on(
      SOCKET_EVENTS.USER_TYPING,
      (data: { userId: string }) => {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.add(data.userId);
          return next;
        });
      }
    );

    socket.on(
      SOCKET_EVENTS.USER_STOP_TYPING,
      (data: { userId: string }) => {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(data.userId);
          return next;
        });
      }
    );

    // Messages seen
    socket.on(
      SOCKET_EVENTS.MESSAGES_SEEN,
      (data: { userId: string }) => {
        // Mark all sent messages to this user as seen
        setMessages((prev) =>
          prev.map((msg) =>
            msg.receiver._id === data.userId && !msg.isSeen
              ? { ...msg, isSeen: true, seenAt: new Date().toISOString() }
              : msg
          )
        );
      }
    );

    return () => {
      disconnectSocket();
    };
    // We intentionally don't include loadConversations in deps to avoid reconnection loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // ── Select Conversation ──────────────────────────────────────────────
  const selectConversation = useCallback(
    async (userId: string) => {
      setActiveUserId(userId);
      setShowSidebar(false);
      setMsgLoading(true);
      setMessages([]);
      setMsgPage(1);

      const result = await getConversation(userId, 1);
      if (result.success) {
        setMessages(result.data || []);
        setMsgTotalPages(result.totalPages || 1);

        if (result.otherUser) {
          setActiveUser({
            _id: result.otherUser._id,
            name: result.otherUser.name,
            avatar: result.otherUser.avatar,
            role: result.otherUser.role,
          });
        }

        // Mark messages from this user as seen
        await markMessagesSeen(userId);
        const socket = getSocket();
        if (socket) {
          socket.emit(SOCKET_EVENTS.MARK_SEEN, { senderId: userId });
        }

        // Refresh conversation list to update unread counts
        loadConversations();
      }
      setMsgLoading(false);
    },
    [loadConversations]
  );

  // ── Load More Messages ───────────────────────────────────────────────
  const loadMoreMessages = useCallback(async () => {
    if (!activeUserId || msgPage >= msgTotalPages || msgLoading) return;

    setMsgLoading(true);
    const nextPage = msgPage + 1;
    const result = await getConversation(activeUserId, nextPage);
    if (result.success && result.data) {
      setMessages((prev) => [...result.data!, ...prev]);
      setMsgPage(nextPage);
      setMsgTotalPages(result.totalPages || 1);
    }
    setMsgLoading(false);
  }, [activeUserId, msgPage, msgTotalPages, msgLoading]);

  // ── Send Message ─────────────────────────────────────────────────────
  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!activeUserId) return;

      // Optimistic UI: immediately show the message
      const optimisticMsg: Message = {
        _id: `temp-${Date.now()}`,
        sender: {
          _id: currentUserId,
          name: "You",
        },
        receiver: {
          _id: activeUserId,
          name: activeUser?.name || "",
        },
        text,
        attachments: [],
        isSeen: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMsg]);

      // Send via REST API (which also emits via socket to receiver)
      const result = await sendMessageAPI({
        receiver: activeUserId,
        text,
      });

      if (result.success && result.data) {
        // Replace optimistic message with real one
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === optimisticMsg._id ? result.data! : msg
          )
        );
        // Refresh sidebar
        loadConversations();
      }
    },
    [activeUserId, currentUserId, activeUser, loadConversations]
  );

  // ── Back to Sidebar (mobile) ────────────────────────────────────────
  const handleBack = () => {
    setShowSidebar(true);
    setActiveUserId(null);
    setActiveUser(null);
    setMessages([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          showSidebar ? "flex" : "hidden"
        } md:flex w-full md:w-[360px] lg:w-[400px] flex-shrink-0`}
      >
        <div className="w-full">
          <ChatSidebar
            conversations={conversations}
            activeUserId={activeUserId}
            onSelectConversation={selectConversation}
            onlineUsers={onlineUsers}
            loading={convLoading}
          />
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`${
          !showSidebar ? "flex" : "hidden"
        } md:flex flex-1 flex-col min-w-0`}
      >
        {activeUserId && activeUser ? (
          <ChatWindow
            messages={messages}
            currentUserId={currentUserId}
            otherUser={activeUser}
            isTyping={typingUsers.has(activeUserId)}
            isOnline={onlineUsers.has(activeUserId)}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
            loading={msgLoading}
            hasMore={msgPage < msgTotalPages}
            onLoadMore={loadMoreMessages}
          />
        ) : (
          <EmptyChatState />
        )}
      </div>
    </div>
  );
}
