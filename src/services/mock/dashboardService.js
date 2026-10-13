import { getWarungs } from './warungService';
import { getRentals } from './rentalService';
import { getApplications } from './applicationService';

// Fallback to fetch photografer from localStorage directly
const getPhotographers = () => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('bedengan_xplore_admin_fotografers');
  if (!data) return [];
  return JSON.parse(data);
};

export const getDashboardStats = async () => {
  const warungs = await getWarungs();
  const rentals = await getRentals();
  const photographers = getPhotographers();
  const applications = await getApplications();
  
  const pendingApps = applications.filter(app => app.status === 'Pending');

  return {
    totalWarung: warungs.length,
    totalRental: rentals.length,
    totalFotografer: photographers.length || 3, // Mock fallback
    pendingPendaftaran: pendingApps.length
  };
};

export const getPendingApplications = async () => {
  const applications = await getApplications();
  return applications.filter(app => app.status === 'Pending').slice(0, 5); // get top 5
};

export const getRecentActivities = async () => {
  return [
    { id: 1, message: 'Warung Soto Bedengan diperbarui', time: '10 menit yang lalu' },
    { id: 2, message: 'Pendaftaran usaha baru masuk', time: '1 jam yang lalu' },
    { id: 3, message: 'Alan Picture menambahkan jasa', time: '3 jam yang lalu' },
    { id: 4, message: 'Bedengan Camp Rental menambah item', time: '1 hari yang lalu' }
  ];
};
