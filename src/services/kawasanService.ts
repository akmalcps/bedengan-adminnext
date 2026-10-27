import { apiClient } from './apiClient';
import { Kawasan } from '@/src/types/kawasan';
import { initialKawasan } from '@/src/data/mock/kawasanMock';

const STORAGE_KEY = 'bedengan_xplore_admin_kawasan';

const getLocalKawasans = (): Kawasan[] => {
  if (typeof window === 'undefined') return initialKawasan;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialKawasan));
    return initialKawasan;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialKawasan;
  }
};

const saveLocalKawasans = (data: Kawasan[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const kawasanService = {
  getAll: async (): Promise<Kawasan[]> => {
    try {
      const response = await apiClient<any>('/kawasan');
      const data = response.data || response;
      if (Array.isArray(data)) return data;
      return getLocalKawasans();
    } catch {
      return getLocalKawasans();
    }
  },

  getById: async (id: string): Promise<Kawasan | null> => {
    try {
      const response = await apiClient<any>(`/kawasan/${id}`);
      return response.data || response || null;
    } catch {
      const items = getLocalKawasans();
      return items.find((k) => String(k.id) === String(id)) || null;
    }
  },

  update: async (id: string, data: Partial<Kawasan>): Promise<Kawasan> => {
    try {
      const response = await apiClient<any>(`/kawasan/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.data || response;
    } catch {
      const items = getLocalKawasans();
      const index = items.findIndex((k) => String(k.id) === String(id));
      if (index !== -1) {
        items[index] = { ...items[index], ...data };
        saveLocalKawasans(items);
        return items[index];
      }
      throw new Error('Kawasan not found');
    }
  },

  toggleStatus: async (id: string): Promise<Kawasan> => {
    const items = getLocalKawasans();
    const index = items.findIndex((k) => String(k.id) === String(id));
    if (index !== -1) {
      items[index].status = items[index].status === 'active' ? 'inactive' : 'active';
      saveLocalKawasans(items);
      return items[index];
    }
    throw new Error('Kawasan not found');
  },
};

export const getKawasans = kawasanService.getAll;
export const getKawasanById = kawasanService.getById;
export const updateKawasan = kawasanService.update;
export const toggleKawasanStatus = kawasanService.toggleStatus;
