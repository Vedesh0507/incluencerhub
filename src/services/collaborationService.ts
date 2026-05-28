const API_BASE = 'http://localhost:5000/api';

// ── Helper to get the JWT token from localStorage ──
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// ── Shared auth headers ──
function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface SendCollaborationData {
  creatorProfile: string;
  campaignTitle: string;
  description: string;
  budget: number;
  barter?: boolean;
  deliverables?: string[];
  deadline: string;
  platform: string;
}

export interface CollaborationRequest {
  _id: string;
  businessUser: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  creatorProfile: {
    _id: string;
    username: string;
    category: string;
    profileImage?: string;
    followers?: number;
  };
  campaignTitle: string;
  description: string;
  budget: number;
  barter: boolean;
  deliverables: string[];
  deadline: string;
  platform: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface CollaborationResult {
  success: boolean;
  data?: CollaborationRequest | CollaborationRequest[];
  count?: number;
  message?: string;
  error?: string;
}

// ─────────────────────────────────────────────
// Send a collaboration request (business → creator)
// POST /api/collaborations
// ─────────────────────────────────────────────
export const sendCollaborationRequest = async (
  data: SendCollaborationData
): Promise<CollaborationResult> => {
  try {
    const res = await fetch(`${API_BASE}/collaborations`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      return { success: false, error: json.message || 'Failed to send collaboration request' };
    }

    return { success: true, data: json.data, message: json.message };
  } catch {
    return { success: false, error: 'Unable to connect to server. Please try again.' };
  }
};

// ─────────────────────────────────────────────
// Get creator's collaboration inbox
// GET /api/collaborations/creator
// ─────────────────────────────────────────────
export const getCreatorInbox = async (): Promise<CollaborationResult> => {
  try {
    const res = await fetch(`${API_BASE}/collaborations/creator`, {
      headers: authHeaders(),
    });

    const json = await res.json();

    if (!res.ok) {
      return { success: false, error: json.message || 'Failed to load inbox' };
    }

    return { success: true, data: json.data, count: json.count };
  } catch {
    return { success: false, error: 'Unable to connect to server. Please try again.' };
  }
};

// ─────────────────────────────────────────────
// Get business's sent collaboration requests
// GET /api/collaborations/business
// ─────────────────────────────────────────────
export const getBusinessRequests = async (): Promise<CollaborationResult> => {
  try {
    const res = await fetch(`${API_BASE}/collaborations/business`, {
      headers: authHeaders(),
    });

    const json = await res.json();

    if (!res.ok) {
      return { success: false, error: json.message || 'Failed to load requests' };
    }

    return { success: true, data: json.data, count: json.count };
  } catch {
    return { success: false, error: 'Unable to connect to server. Please try again.' };
  }
};

// ─────────────────────────────────────────────
// Update collaboration status (creator only)
// PUT /api/collaborations/:id/status
// ─────────────────────────────────────────────
export const updateCollaborationStatus = async (
  id: string,
  status: 'accepted' | 'rejected' | 'completed'
): Promise<CollaborationResult> => {
  try {
    const res = await fetch(`${API_BASE}/collaborations/${id}/status`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ status }),
    });

    const json = await res.json();

    if (!res.ok) {
      return { success: false, error: json.message || 'Failed to update status' };
    }

    return { success: true, data: json.data, message: json.message };
  } catch {
    return { success: false, error: 'Unable to connect to server. Please try again.' };
  }
};
