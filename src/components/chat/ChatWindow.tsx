"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, ArrowLeft, Loader2 } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import type { Message } from "@/services/messageService";
import { getSocket, SOCKET_EVENTS } from "@/services/socketService";

interface ChatWindowProps {
  messages: Message[];
  currentUserId: string;
  otherUser: {
    _id: string;
    name: string;
    avatar?: string;
    role?: string;
  } | null;
  isTyping: boolean;
  isOnline: boolean;
  onSendMessage: (text: string) => void;
  onBack: () => void;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function ChatWindow({
  messages,
  currentUserId,
  otherUser,
  isTyping,
  isOnline,
  onSendMessage,
  onBack,
  loading,
  hasMore,
  onLoadMore,
}: ChatWindowProps) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isUserTyping, setIsUserTyping] = useState(false);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  // Emit typing indicators
  const handleTyping = () => {
    const socket = getSocket();
    if (!socket || !otherUser) return;

    if (!isUserTyping) {
      setIsUserTyping(true);
      socket.emit(SOCKET_EVENTS.TYPING, { receiver: otherUser._id });
    }

    // Clear and reset timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false);
      socket.emit(SOCKET_EVENTS.STOP_TYPING, { receiver: otherUser._id });
    }, 1500);
  };

  // Handle scroll for load more
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container && container.scrollTop === 0 && hasMore && !loading) {
      onLoadMore();
    }
  };

  const handleSend = async () => {
    if (!text.trim() || sending) return;

    setSending(true);
    const messageText = text.trim();
    setText("");

    // Stop typing indicator
    const socket = getSocket();
    if (socket && otherUser) {
      socket.emit(SOCKET_EVENTS.STOP_TYPING, { receiver: otherUser._id });
    }
    setIsUserTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    onSendMessage(messageText);
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!otherUser) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
        {/* Back button (mobile) */}
        <button
          onClick={onBack}
          className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* User avatar */}
        <div className="relative">
          {otherUser.avatar ? (
            <img
              src={otherUser.avatar}
              alt={otherUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
              {getInitials(otherUser.name)}
            </div>
          )}
          {/* Online indicator */}
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              isOnline ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        </div>

        {/* User info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {otherUser.name}
          </h3>
          <p className="text-xs text-gray-500">
            {isOnline ? (
              <span className="text-green-600 font-medium">Online</span>
            ) : (
              "Offline"
            )}
            {otherUser.role && (
              <span className="ml-2 capitalize text-gray-400">
                · {otherUser.role}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Load more indicator */}
        {loading && (
          <div className="flex justify-center py-3">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          </div>
        )}

        {hasMore && !loading && (
          <button
            onClick={onLoadMore}
            className="w-full py-2 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Load earlier messages
          </button>
        )}

        {/* Messages */}
        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isOwn={msg.sender._id === currentUserId}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator userName={otherUser.name} />}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-200">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                handleTyping();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all max-h-32"
              style={{ minHeight: "40px" }}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="flex-shrink-0 p-2.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm hover:shadow-md"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
