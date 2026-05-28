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

export interface NotificationItem {
  _id: string;
  user: string;
  type: 'collaboration_request' | 'collaboration_accepted' | 'collaboration_rejected' | 'new_message';
  title: string;
  message: string;
  link: string;
  relatedUser?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResult {
  success: boolean;
  data?: NotificationItem[];
  total?: number;
  unreadCount?: number;
  page?: number;
  totalPages?: number;
  error?: string;
}

// ── API Calls ────────────────────────────────────────────────────────────────

export const getNotifications = async (page: number = 1): Promise<NotificationsResult> => {
  try {
    const res = await fetch(`${API_BASE}/notifications?page=${page}`, {
      headers: authHeaders(),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.message || 'Failed to load notifications' };
    return {
      success: true,
      data: json.data,
      total: json.total,
      unreadCount: json.unreadCount,
      page: json.page,
      totalPages: json.totalPages,
    };
  } catch {
    return { success: false, error: 'Unable to connect to server.' };
  }
};

export const markNotificationRead = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: authHeaders(),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.message || 'Failed to mark read' };
    return { success: true };
  } catch {
    return { success: false, error: 'Unable to connect to server.' };
  }
};

export const markAllNotificationsRead = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: authHeaders(),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.message || 'Failed to mark all read' };
    return { success: true };
  } catch {
    return { success: false, error: 'Unable to connect to server.' };
  }
};
