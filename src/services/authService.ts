import { apiClient } from './apiClient';
import { LoginPayload } from '@/src/types/auth-api';
import { AdminUser } from '@/src/types/auth';

export const authService = {
  login: async (payload: LoginPayload): Promise<{ token: string; user: AdminUser }> => {
    try {
      const response = await apiClient<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Handle common API response shapes: { data: { token, user } } or { token, user }
      const token = response.data?.token || response.token;
      const user = response.data?.user || response.user || {
        name: response.data?.name || payload.email?.split('@')[0] || 'Admin',
        email: payload.email || 'admin@bedenganxplore.test',
        role: response.data?.role || 'Administrator',
        initials: 'AD',
        avatar: `https://ui-avatars.com/api/?name=Admin&background=85BB45&color=fff`,
      };

      if (!token) {
        throw new Error('Token tidak ditemukan dalam respon backend.');
      }

      return { token, user };
    } catch (error: any) {
      // If backend network error or demo mode fallback
      if (
        (payload.email === 'admin@bedenganxplore.test' || payload.email === 'admin@bedenganxplore.id') &&
        payload.password === 'admin123' &&
        (error?.status === 0 || error?.status === 404)
      ) {
        console.warn('Backend endpoint /auth/login tidak merespon, menggunakan demo login fallback.');
        return {
          token: 'demo-jwt-token-bedengan-admin-secret',
          user: {
            name: 'Admin Bedengan',
            email: payload.email,
            role: 'Administrator',
            initials: 'AB',
            avatar: 'https://ui-avatars.com/api/?name=Admin+Bedengan&background=85BB45&color=fff',
          },
        };
      }
      throw error;
    }
  },

  getProfile: async (): Promise<AdminUser> => {
    const response = await apiClient<any>('/auth/profile');
    return response.data || response;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    }
  },
};
