"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export function EmptyChatState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-6"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center mx-auto">
          <MessageCircle className="w-12 h-12 text-blue-400" />
        </div>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="text-xl font-semibold text-gray-800 mb-2"
      >
        Your Messages
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="text-gray-500 max-w-sm text-sm leading-relaxed"
      >
        Select a conversation from the sidebar to start chatting with creators and businesses.
      </motion.p>
    </div>
  );
}
