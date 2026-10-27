import { apiClient } from './apiClient';
import { Fotografer } from '@/src/types/fotografer';
import { initialFotografer } from '@/src/data/mock/fotograferMock';

const STORAGE_KEY = 'bedengan_xplore_admin_fotografers';

const getLocalFotografers = (): Fotografer[] => {
  if (typeof window === 'undefined') return initialFotografer as unknown as Fotografer[];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialFotografer));
    return initialFotografer as unknown as Fotografer[];
  }
  try {
    return JSON.parse(data);
  } catch {
    return initialFotografer as unknown as Fotografer[];
  }
};

const saveLocalFotografers = (data: Fotografer[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

export const fotograferService = {
  getAll: async (): Promise<Fotografer[]> => {
    try {
      const response = await apiClient<any>('/fotografers');
      const data = response.data || response;
      if (Array.isArray(data)) return data;
      return getLocalFotografers();
    } catch {
      return getLocalFotografers();
    }
  },

  getById: async (id: string): Promise<Fotografer | null> => {
    try {
      const response = await apiClient<any>(`/fotografers/${id}`);
      return response.data || response || null;
    } catch {
      const items = getLocalFotografers();
      return items.find((f) => String(f.id) === String(id)) || null;
    }
  },

  create: async (data: Omit<Fotografer, 'id'>): Promise<Fotografer> => {
    try {
      const response = await apiClient<any>('/fotografers', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.data || response;
    } catch {
      const items = getLocalFotografers();
      const newFotografer: Fotografer = {
        ...data,
        id: Date.now().toString(),
        updatedAt: new Date().toISOString(),
      };
      saveLocalFotografers([...items, newFotografer]);
      return newFotografer;
    }
  },

  update: async (id: string, data: Partial<Fotografer>): Promise<Fotografer> => {
    try {
      const response = await apiClient<any>(`/fotografers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.data || response;
    } catch {
      const items = getLocalFotografers();
      const index = items.findIndex((f) => String(f.id) === String(id));
      if (index !== -1) {
        items[index] = { ...items[index], ...data, updatedAt: new Date().toISOString() };
        saveLocalFotografers(items);
        return items[index];
      }
      throw new Error('Fotografer not found');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient(`/fotografers/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    const items = getLocalFotografers();
    saveLocalFotografers(items.filter((f) => String(f.id) !== String(id)));
  },

  toggleStatus: async (id: string): Promise<Fotografer> => {
    const items = getLocalFotografers();
    const index = items.findIndex((f) => String(f.id) === String(id));
    if (index !== -1) {
      items[index].status = items[index].status === 'active' ? 'inactive' : 'active';
      saveLocalFotografers(items);
      return items[index];
    }
    throw new Error('Fotografer not found');
  },
};

export const getFotografers = fotograferService.getAll;
export const getFotograferById = fotograferService.getById;
export const createFotografer = fotograferService.create;
export const updateFotografer = fotograferService.update;
export const deleteFotografer = fotograferService.delete;
export const toggleFotograferStatus = fotograferService.toggleStatus;
