import { apiClient } from './apiClient';
import { Warung } from '@/src/types/warung';
import { initialWarung } from '@/src/data/mock/warungMock';

const STORAGE_KEY = 'bedengan_xplore_admin_warungs';

const getLocalWarungs = (): Warung[] => {
  if (typeof window === 'undefined') return initialWarung;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialWarung));
    return initialWarung;
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialWarung;
  }
};

const saveLocalWarungs = (data: Warung[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const warungService = {
  getAll: async (): Promise<Warung[]> => {
    try {
      const response = await apiClient<any>('/warungs');
      const data = response.data || response;
      if (Array.isArray(data)) return data;
      return getLocalWarungs();
    } catch {
      return getLocalWarungs();
    }
  },

  getById: async (id: string): Promise<Warung | null> => {
    try {
      const response = await apiClient<any>(`/warungs/${id}`);
      return response.data || response || null;
    } catch {
      const items = getLocalWarungs();
      return items.find((w) => String(w.id) === String(id)) || null;
    }
  },

  create: async (data: Omit<Warung, 'id'>): Promise<Warung> => {
    try {
      const response = await apiClient<any>('/warungs', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.data || response;
    } catch {
      const items = getLocalWarungs();
      const newWarung: Warung = {
        ...data,
        id: Date.now().toString(),
        updatedAt: new Date().toISOString(),
      };
      saveLocalWarungs([...items, newWarung]);
      return newWarung;
    }
  },

  update: async (id: string, data: Partial<Warung>): Promise<Warung> => {
    try {
      const response = await apiClient<any>(`/warungs/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.data || response;
    } catch {
      const items = getLocalWarungs();
      const index = items.findIndex((w) => String(w.id) === String(id));
      if (index !== -1) {
        items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
        saveLocalWarungs(items);
        return items[index];
      }
      throw new Error('Warung not found');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient(`/warungs/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    const items = getLocalWarungs();
    saveLocalWarungs(items.filter((w) => String(w.id) !== String(id)));
  },

  toggleStatus: async (id: string): Promise<Warung> => {
    const items = getLocalWarungs();
    const index = items.findIndex((w) => String(w.id) === String(id));
    if (index !== -1) {
      items[index].status = items[index].status === 'active' ? 'inactive' : 'active';
      saveLocalWarungs(items);
      return items[index];
    }
    throw new Error('Warung not found');
  },
};

export const getWarungs = warungService.getAll;
export const getWarungById = warungService.getById;
export const createWarung = warungService.create;
export const updateWarung = warungService.update;
export const deleteWarung = warungService.delete;
export const toggleWarungStatus = warungService.toggleStatus;
