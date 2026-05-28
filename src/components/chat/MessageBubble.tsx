"use client";

import { motion } from "framer-motion";
import type { Message } from "@/services/messageService";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`relative max-w-[75%] md:max-w-[65%] px-4 py-2.5 rounded-2xl ${
          isOwn
            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md"
            : "bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm"
        }`}
      >
        {/* Message text */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.text}
        </p>

        {/* Time + seen indicator */}
        <div
          className={`flex items-center gap-1.5 mt-1 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <span
            className={`text-[10px] ${
              isOwn ? "text-blue-200" : "text-gray-400"
            }`}
          >
            {time}
          </span>

          {/* Seen status for own messages */}
          {isOwn && (
            <span className="text-[10px]">
              {message.isSeen ? (
                <svg
                  className="w-3.5 h-3.5 text-blue-200"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M1 13l5 5L20 4" />
                  <path d="M7 13l5 5L23 4" />
                </svg>
              ) : (
                <svg
                  className="w-3.5 h-3.5 text-blue-300/50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M4 13l5 5L20 4" />
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
