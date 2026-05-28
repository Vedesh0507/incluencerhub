"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MessageCircle } from "lucide-react";
import type { ConversationItem } from "@/services/messageService";

interface ChatSidebarProps {
  conversations: ConversationItem[];
  activeUserId: string | null;
  onSelectConversation: (userId: string) => void;
  onlineUsers: Set<string>;
  loading: boolean;
}

export function ChatSidebar({
  conversations,
  activeUserId,
  onSelectConversation,
  onlineUsers,
  loading,
}: ChatSidebarProps) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((conv) =>
    conv.userDetails.name.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          Messages
        </h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          // Skeleton loading
          <div className="p-3 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <MessageCircle className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm text-gray-500">
              {search ? "No conversations found" : "No conversations yet"}
            </p>
            {!search && (
              <p className="text-xs text-gray-400 mt-1">
                Start by collaborating with someone
              </p>
            )}
          </div>
        ) : (
          <div className="p-2">
            {filtered.map((conv) => {
              const isActive = activeUserId === conv._id;
              const isOnline = onlineUsers.has(conv._id);

              return (
                <motion.button
                  key={conv._id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onSelectConversation(conv._id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                    isActive
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {conv.userDetails.avatar ? (
                      <img
                        src={conv.userDetails.avatar}
                        alt={conv.userDetails.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                        {getInitials(conv.userDetails.name)}
                      </div>
                    )}
                    {/* Online dot */}
                    <span
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        isOnline ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className={`text-sm font-semibold truncate ${
                          conv.unreadCount > 0
                            ? "text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {conv.userDetails.name}
                      </span>
                      <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                        {formatTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-xs truncate ${
                          conv.unreadCount > 0
                            ? "text-gray-700 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {conv.lastMessage}
                      </p>
                      {/* Unread badge */}
                      {conv.unreadCount > 0 && (
                        <span className="flex-shrink-0 ml-2 min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                          {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
