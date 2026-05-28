const API_BASE = 'http://localhost:5000/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MessageUser {
  _id: string;
  name: string;
  avatar?: string;
}

export interface Message {
  _id: string;
  sender: MessageUser;
  receiver: MessageUser;
  text: string;
  attachments: string[];
  collaboration?: string;
  isSeen: boolean;
  seenAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationItem {
  _id: string;
  lastMessage: string;
  lastMessageAt: string;
  lastMessageSender: string;
  unreadCount: number;
  userDetails: {
    name: string;
    email: string;
    avatar: string;
    role: string;
  };
}

export interface ConversationListResult {
  success: boolean;
  data?: ConversationItem[];
  error?: string;
}

export interface ConversationResult {
  success: boolean;
  data?: Message[];
  total?: number;
  page?: number;
  totalPages?: number;
  otherUser?: MessageUser & { role: string; email: string };
  error?: string;
}

export interface SendMessageResult {
  success: boolean;
  data?: Message;
  message?: string;
  error?: string;
}

// ── API Calls ────────────────────────────────────────────────────────────────

export const getConversationList = async (): Promise<ConversationListResult> => {
  try {
    const res = await fetch(`${API_BASE}/messages/conversations/list`, {
      headers: authHeaders(),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.message || 'Failed to load conversations' };
    return { success: true, data: json.data };
  } catch {
    return { success: false, error: 'Unable to connect to server.' };
  }
};

export const getConversation = async (
  userId: string,
  page: number = 1
): Promise<ConversationResult> => {
  try {
    const res = await fetch(`${API_BASE}/messages/${userId}?page=${page}`, {
      headers: authHeaders(),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.message || 'Failed to load messages' };
    return {
      success: true,
      data: json.data,
      total: json.total,
      page: json.page,
      totalPages: json.totalPages,
      otherUser: json.otherUser,
    };
  } catch {
    return { success: false, error: 'Unable to connect to server.' };
  }
};

export const sendMessage = async (data: {
  receiver: string;
  text: string;
  collaboration?: string;
}): Promise<SendMessageResult> => {
  try {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.message || 'Failed to send message' };
    return { success: true, data: json.data, message: json.message };
  } catch {
    return { success: false, error: 'Unable to connect to server.' };
  }
};

export const markMessagesSeen = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await fetch(`${API_BASE}/messages/seen/${userId}`, {
      method: 'PUT',
      headers: authHeaders(),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.message || 'Failed to mark seen' };
    return { success: true };
  } catch {
    return { success: false, error: 'Unable to connect to server.' };
  }
};
