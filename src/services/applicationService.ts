import { apiClient } from './apiClient';
import { Application } from '@/src/types/application';
import { initialApplication } from '@/src/data/mock/applicationMock';

const STORAGE_KEY = 'bedengan_xplore_admin_applications';

const getLocalStorageApplications = (): Application[] => {
  if (typeof window === 'undefined') return initialApplication as unknown as Application[];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialApplication));
    return initialApplication as unknown as Application[];
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialApplication as unknown as Application[];
  }
};

const setLocalStorageApplications = (data: Application[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('applications_updated'));
  }
};

export const applicationService = {
  getApplications: async (): Promise<Application[]> => {
    try {
      const response = await apiClient<any>('/applications');
      const data = response.data || response;
      if (Array.isArray(data)) return data;
      return getLocalStorageApplications();
    } catch {
      return getLocalStorageApplications();
    }
  },

  getApplicationById: async (id: string): Promise<Application | null> => {
    try {
      const response = await apiClient<any>(`/applications/${id}`);
      return response.data || response || null;
    } catch {
      const apps = getLocalStorageApplications();
      return apps.find((item) => String(item.id) === String(id)) || null;
    }
  },

  approveApplication: async (id: string): Promise<Application> => {
    try {
      const response = await apiClient<any>(`/applications/${id}/approve`, { method: 'POST' });
      return response.data || response;
    } catch {
      const data = getLocalStorageApplications();
      const index = data.findIndex((item) => String(item.id) === String(id));
      if (index !== -1) {
        data[index] = { ...data[index], status: 'Approved' };
        setLocalStorageApplications(data);
        return data[index];
      }
      throw new Error('Application not found');
    }
  },

  rejectApplication: async (id: string, reason: string): Promise<Application> => {
    try {
      const response = await apiClient<any>(`/applications/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      return response.data || response;
    } catch {
      const data = getLocalStorageApplications();
      const index = data.findIndex((item) => String(item.id) === String(id));
      if (index !== -1) {
        data[index] = { ...data[index], status: 'Rejected', rejectionReason: reason };
        setLocalStorageApplications(data);
        return data[index];
      }
      throw new Error('Application not found');
    }
  },
};

export const getApplications = applicationService.getApplications;
export const getApplicationById = applicationService.getApplicationById;
export const approveApplication = applicationService.approveApplication;
export const rejectApplication = applicationService.rejectApplication;
