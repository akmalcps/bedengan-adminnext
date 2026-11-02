import { apiClient } from './apiClient';
import { Application, ApplicationStatus } from '@/src/types/application';

/**
 * Adapter untuk mengubah format database/backend catalog menjadi interface Application frontend
 */
export const mapCatalogToApplication = (item: any): Application => {
  const statusRaw = String(item.status || 'pending').toLowerCase();
  let status: ApplicationStatus = 'Pending';
  if (statusRaw === 'approved') status = 'Approved';
  else if (statusRaw === 'rejected') status = 'Rejected';

  let categoryLabel = 'UMKM Lokal';
  if (item.category === 'rental') categoryLabel = 'Penyewaan Alat';
  else if (item.category === 'warung') categoryLabel = 'Warung & Kuliner';
  else if (item.category === 'photographer') categoryLabel = 'Jasa Fotografi';

  const imageList = item.image_url ? [item.image_url] : [];

  return {
    id: String(item.id),
    applicantName: item.applicant_name || 'Warga Pemohon',
    businessName: item.name || '',
    category: categoryLabel,
    description: item.description || '',
    whatsapp: item.contact_phone || '',
    address: item.location_note || '',
    images: imageList,
    status,
    submittedAt: item.created_at || new Date().toISOString(),
    rejectionReason: null,
  };
};

export const applicationService = {
  getApplications: async (): Promise<Application[]> => {
    // Ambil seluruh katalog (status all) agar riwayat Pending, Approved, dan Rejected terbaca
    const response = await apiClient<any>('/catalogs?status=all');
    const rawList = response.data || response;
    if (Array.isArray(rawList)) {
      return rawList.map(mapCatalogToApplication);
    }
    return [];
  },

  getApplicationById: async (id: string): Promise<Application | null> => {
    const response = await apiClient<any>(`/catalogs/${id}`);
    const data = response.data || response;
    if (!data) return null;
    return mapCatalogToApplication(data);
  },

  approveApplication: async (id: string): Promise<Application> => {
    const response = await apiClient<any>(`/catalogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: 'approved',
      }),
    });

    const updated = response.data || response;
    return mapCatalogToApplication(updated);
  },

  rejectApplication: async (id: string, reason?: string): Promise<Application> => {
    const response = await apiClient<any>(`/catalogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: 'rejected',
      }),
    });

    const updated = response.data || response;
    const mapped = mapCatalogToApplication(updated);
    if (reason) {
      mapped.rejectionReason = reason;
    }
    return mapped;
  },
};

export const getApplications = applicationService.getApplications;
export const getApplicationById = applicationService.getApplicationById;
export const approveApplication = applicationService.approveApplication;
export const rejectApplication = applicationService.rejectApplication;
