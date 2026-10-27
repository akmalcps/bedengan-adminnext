import { rentalService } from './rentalService';
import { applicationService } from './applicationService';

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
      const rentals = await rentalService.getAll();
      const applications = await applicationService.getApplications();
      const pendingApps = applications.filter((app) => app.status === 'Pending');

      // Fetch warungs from local if available
      let warungCount = 4;
      if (typeof window !== 'undefined') {
        const warungs = localStorage.getItem('bedengan_xplore_admin_warungs');
        if (warungs) {
          try {
            warungCount = JSON.parse(warungs).length;
          } catch {
            // ignore
          }
        }
      }

      return {
        totalWarung: warungCount,
        totalRental: rentals.length,
        totalFotografer: 3,
        pendingPendaftaran: pendingApps.length,
      };
    } catch {
      return {
        totalWarung: 4,
        totalRental: 1,
        totalFotografer: 3,
        pendingPendaftaran: 2,
      };
    }
  },

  getPendingApplications: async () => {
    const applications = await applicationService.getApplications();
    return applications.filter((app) => app.status === 'Pending').slice(0, 5);
  },

  getRecentActivities: async (): Promise<ActivityItem[]> => {
    return [
      { id: 1, message: 'Warung Soto Bedengan diperbarui', time: '10 menit yang lalu' },
      { id: 2, message: 'Pendaftaran usaha baru masuk', time: '1 jam yang lalu' },
      { id: 3, message: 'Alan Picture menambahkan jasa', time: '3 jam yang lalu' },
      { id: 4, message: 'Bedengan Camp Rental menambah item', time: '1 hari yang lalu' },
    ];
  },
};

export const getDashboardStats = dashboardService.getStats;
export const getPendingApplications = dashboardService.getPendingApplications;
export const getRecentActivities = dashboardService.getRecentActivities;
