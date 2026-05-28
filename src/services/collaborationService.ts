const API_BASE = 'http://localhost:5000/api';

// ── Helpers ───────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type CollaborationStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

export interface SendCollaborationData {
  creatorProfile: string;
  campaignTitle: string;
  description: string;
  budget: number;
  barter?: boolean;
  deliverables?: string[];
  deadline: string;
  platform: string;
  notes?: string;
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
    pricing?: { reel: number; story: number; post: number };
  };
  campaignTitle: string;
  description: string;
  budget: number;
  barter: boolean;
  deliverables: string[];
  deadline: string;
  platform: string;
  status: CollaborationStatus;
  notes?: string;
  completedAt?: string;
  cancelledAt?: string;
  statusUpdatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollaborationResult {
  success: boolean;
  data?: CollaborationRequest | CollaborationRequest[];
  count?: number;
  total?: number;
  page?: number;
  totalPages?: number;
  message?: string;
  error?: string;
}

export interface CreatorStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  completed: number;
  cancelled: number;
  totalEarnings: number;
  activeCollaborations: number;
}

export interface BusinessStats {
  total: number;
  sentRequests: number;
  pending: number;
  acceptedCreators: number;
  rejected: number;
  completed: number;
  cancelled: number;
  activeCampaigns: number;
  totalBudgetSpent: number;
}

export interface StatsResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ListQueryParams {
  status?: CollaborationStatus;
  platform?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// ─────────────────────────────────────────────
// Send collaboration request (business → creator)
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
    if (!res.ok) return { success: false, error: json.message || 'Failed to send collaboration request' };
    return { success: true, data: json.data, message: json.message };
  } catch {
    return { success: false, error: 'Unable to connect to server. Please try again.' };
  }
};

// ─────────────────────────────────────────────
// Creator inbox
// GET /api/collaborations/creator
// ─────────────────────────────────────────────
export const getCreatorInbox = async (params?: ListQueryParams): Promise<CollaborationResult> => {
  try {
    const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    const res = await fetch(`${API_BASE}/collaborations/creator${qs}`, { headers: authHeaders() });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.message || 'Failed to load inbox' };
    return { success: true, data: json.data, count: json.count, total: json.total, page: json.page, totalPages: json.totalPages };
  } catch {
    return { success: false, error: 'Unable to connect to server. Please try again.' };
  }
};

// ─────────────────────────────────────────────
// Business sent requests
// GET /api/collaborations/business
// ─────────────────────────────────────────────
export const getBusinessRequests = async (params?: ListQueryParams): Promise<CollaborationResult> => {
  try {
    const qs = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    const res = await fetch(`${API_BASE}/collaborations/business${qs}`, { headers: authHeaders() });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.message || 'Failed to load requests' };
    return { success: true, data: json.data, count: json.count, total: json.total, page: json.page, totalPages: json.totalPages };
  } catch {
    return { success: false, error: 'Unable to connect to server. Please try again.' };
  }
};

// ─────────────────────────────────────────────
// Get single collaboration by ID
// GET /api/collaborations/:id
// ─────────────────────────────────────────────
export const getCollaborationById = async (id: string): Promise<CollaborationResult> => {
  try {
    const res = await fetch(`${API_BASE}/collaborations/${id}`, { headers: authHeaders() });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.message || 'Failed to load collaboration' };
    return { success: true, data: json.data };
  } catch {
    return { success: false, error: 'Unable to connect to server. Please try again.' };
  }
};

// ─────────────────────────────────────────────
// Update collaboration status
// PUT /api/collaborations/:id/status
// ─────────────────────────────────────────────
export const updateCollaborationStatus = async (
  id: string,
  status: CollaborationStatus,
  notes?: string
): Promise<CollaborationResult> => {
  try {
    const res = await fetch(`${API_BASE}/collaborations/${id}/status`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ status, notes }),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.message || 'Failed to update status' };
    return { success: true, data: json.data, message: json.message };
  } catch {
    return { success: false, error: 'Unable to connect to server. Please try again.' };
  }
};

// ─────────────────────────────────────────────
// Creator dashboard stats
// GET /api/dashboard/creator/stats
// ─────────────────────────────────────────────
export const getCreatorStats = async (): Promise<StatsResult<CreatorStats>> => {
  try {
    const res = await fetch(`${API_BASE}/dashboard/creator/stats`, { headers: authHeaders() });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.message || 'Failed to load stats' };
    return { success: true, data: json.data };
  } catch {
    return { success: false, error: 'Unable to connect to server. Please try again.' };
  }
};

// ─────────────────────────────────────────────
// Business dashboard stats
// GET /api/dashboard/business/stats
// ─────────────────────────────────────────────
export const getBusinessStats = async (): Promise<StatsResult<BusinessStats>> => {
  try {
    const res = await fetch(`${API_BASE}/dashboard/business/stats`, { headers: authHeaders() });
    const json = await res.json();
    if (!res.ok) return { success: false, error: json.message || 'Failed to load stats' };
    return { success: true, data: json.data };
  } catch {
    return { success: false, error: 'Unable to connect to server. Please try again.' };
  }
};
