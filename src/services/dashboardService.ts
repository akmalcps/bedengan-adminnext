import { apiClient } from './apiClient';
import { applicationService, mapCatalogToApplication } from './applicationService';
import { Application } from '@/src/types/application';

export interface DashboardStats {
  totalWarung: number;
  totalRental: number;
  totalFotografer: number;
  pendingPendaftaran: number;
}

export interface ActivityItem {
  id: number | string;
  message: string;
  time: string;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await apiClient<any>('/home/dashboard');
      const data = response.data || response;

      return {
        totalWarung: data.total_warung || 0,
        totalRental: data.total_rental || 0,
        totalFotografer: data.total_photographer || 0,
        pendingPendaftaran: data.pending_count !== undefined ? data.pending_count : (data.pending_registrations?.length || 0),
      };
    } catch (error) {
      // Jika terjadi kegagalan, lempar error asli agar UI dapat menangani dengan jujur
      throw error;
    }
  },

  getPendingApplications: async (): Promise<Application[]> => {
    try {
      const response = await apiClient<any>('/home/dashboard');
      const data = response.data || response;
      if (Array.isArray(data?.pending_registrations)) {
        return data.pending_registrations.map(mapCatalogToApplication);
      }
      const allApps = await applicationService.getApplications();
      return allApps.filter((a) => a.status === 'Pending').slice(0, 5);
    } catch {
      const allApps = await applicationService.getApplications();
      return allApps.filter((a) => a.status === 'Pending').slice(0, 5);
    }
  },

  getRecentActivities: async (): Promise<ActivityItem[]> => {
    try {
      const response = await apiClient<any>('/home/dashboard');
      const data = response.data || response;

      if (Array.isArray(data?.recent_activities) && data.recent_activities.length > 0) {
        return data.recent_activities.map((act: any) => ({
          id: act.id,
          message: `${act.name} (${act.category}) baru ditambahkan/diperbarui`,
          time: new Date(act.timestamp).toLocaleDateString('id-ID'),
        }));
      }

      return [
        { id: 1, message: 'Data operasional Bedengan tersinkronisasi', time: 'Hari ini' },
      ];
    } catch {
      return [
        { id: 1, message: 'Data operasional Bedengan tersinkronisasi', time: 'Hari ini' },
      ];
    }
  },
};

export const getDashboardStats = dashboardService.getStats;
export const getPendingApplications = dashboardService.getPendingApplications;
export const getRecentActivities = dashboardService.getRecentActivities;
