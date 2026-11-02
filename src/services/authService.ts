import { apiClient } from './apiClient';
import { LoginPayload } from '@/src/types/auth-api';
import { AdminUser } from '@/src/types/auth';

export const authService = {
  login: async (payload: LoginPayload): Promise<{ token: string; user: AdminUser }> => {
    const response = await apiClient<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const token = response.data?.token || response.token;
    const adminData = response.data?.admin || response.data?.user || response.user;

    if (!token) {
      throw new Error('Token otentikasi tidak ditemukan dalam respon backend.');
    }

    const user: AdminUser = {
      id: String(adminData?.id || ''),
      name: adminData?.name || payload.email?.split('@')[0] || 'Admin Bedengan',
      email: adminData?.email || payload.email || 'admin@bedengan.com',
      role: 'Administrator',
      initials: (adminData?.name || 'Admin').substring(0, 2).toUpperCase(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(adminData?.name || 'Admin')}&background=85BB45&color=fff`,
    };

    return { token, user };
  },

  getProfile: async (): Promise<AdminUser> => {
    const response = await apiClient<any>('/auth/me');
    const admin = response.data?.admin || response.data || response;

    return {
      id: String(admin?.id || ''),
      name: admin?.name || 'Admin Bedengan',
      email: admin?.email || '',
      role: 'Administrator',
      initials: (admin?.name || 'Admin').substring(0, 2).toUpperCase(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(admin?.name || 'Admin')}&background=85BB45&color=fff`,
    };
  },

  updateProfile: async (payload: {
    name?: string;
    current_password?: string;
    new_password?: string;
  }): Promise<AdminUser> => {
    const response = await apiClient<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    const admin = response.data?.admin || response.data || response;

    return {
      id: String(admin?.id || ''),
      name: admin?.name || 'Admin Bedengan',
      email: admin?.email || '',
      role: 'Administrator',
      initials: (admin?.name || 'Admin').substring(0, 2).toUpperCase(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(admin?.name || 'Admin')}&background=85BB45&color=fff`,
    };
  },

  logout: async (): Promise<void> => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bedengan_admin_token');
      localStorage.removeItem('bedengan_admin_user');
    }
  },
};
