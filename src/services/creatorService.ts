const API_BASE = 'http://localhost:5000/api';

export interface CreatorFilters {
  category?: string;
  location?: string;
  platform?: string;
  minFollowers?: number;
  maxPrice?: number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface CreatorProfileData {
  username: string;
  category: string;
  bio?: string;
  location?: string;
  followers?: number;
  engagementRate?: number;
  pricing?: { reel: number; story: number; post: number };
  platforms?: string[];
  profileImage?: string;
  portfolioImages?: string[];
  socialLinks?: { instagram?: string; youtube?: string; linkedin?: string };
}

export const getAllCreators = async (filters: CreatorFilters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      params.append(key, String(value));
    }
  });

  const queryString = params.toString();
  const url = `${API_BASE}/creators${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch creators');
  return res.json();
};

export const getCreatorById = async (id: string) => {
  const res = await fetch(`${API_BASE}/creators/${id}`);
  if (!res.ok) throw new Error('Failed to fetch creator');
  return res.json();
};

export const createCreatorProfile = async (data: CreatorProfileData, token: string) => {
  const res = await fetch(`${API_BASE}/creators`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to create profile');
  return json;
};

export const updateCreatorProfile = async (id: string, data: Partial<CreatorProfileData>, token: string) => {
  const res = await fetch(`${API_BASE}/creators/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update profile');
  return json;
};
