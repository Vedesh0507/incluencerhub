const API_BASE = 'http://localhost:5000/api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  data?: {
    user: { id: string; name: string; email: string; role: string; avatar: string; isVerified: boolean };
    token: string;
    message: string;
  };
  error?: string;
}

export interface MeResult {
  success: boolean;
  data?: {
    user: { id: string; name: string; email: string; role: string; avatar: string; isVerified: boolean };
  };
  error?: string;
}

export const register = async (data: RegisterData): Promise<AuthResult> => {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      // Expected API error (validation, duplicate, etc.) — return as result, not throw
      return { success: false, error: json.message || 'Registration failed' };
    }

    return { success: true, data: json };
  } catch (networkErr) {
    // Unexpected network failure — log it but still return cleanly
    console.error('[authService] register network error:', networkErr);
    return { success: false, error: 'Unable to connect to server. Please try again.' };
  }
};

export const login = async (data: LoginData): Promise<AuthResult> => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      return { success: false, error: json.message || 'Invalid credentials' };
    }

    return { success: true, data: json };
  } catch (networkErr) {
    console.error('[authService] login network error:', networkErr);
    return { success: false, error: 'Unable to connect to server. Please try again.' };
  }
};

export const getMe = async (token: string): Promise<MeResult> => {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await res.json();

    if (!res.ok) {
      return { success: false, error: json.message || 'Failed to fetch user' };
    }

    return { success: true, data: json };
  } catch (networkErr) {
    console.error('[authService] getMe network error:', networkErr);
    return { success: false, error: 'Unable to connect to server.' };
  }
};
