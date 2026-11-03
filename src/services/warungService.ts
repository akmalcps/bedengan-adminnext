import { apiClient } from './apiClient';
import { Warung } from '@/src/types/warung';
import { ensureArray, formatOperatingHours, parseOperatingHours } from '@/src/utils/format';

/**
 * Adapter untuk mengubah format database/backend catalog menjadi interface Warung frontend
 */
export const mapCatalogToWarung = (item: any): Warung => {
  const { openingTime, closingTime } = parseOperatingHours(item.operating_hours);
  const statusStr = String(item.status || '').toLowerCase();
  const isActive = statusStr === 'approved' || statusStr === 'active';

  return {
    id: String(item.id),
    name: item.name || '',
    description: item.description || '',
    whatsapp: item.contact_phone || item.whatsapp || '',
    address: item.location_note || item.address || '',
    image: item.image_url || item.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500',
    openingTime,
    closingTime,
    tags: ensureArray(item.tags),
    status: isActive ? 'active' : 'inactive',
    updatedAt: item.updated_at || item.created_at || new Date().toISOString(),
  };
};

export const warungService = {
  getAll: async (): Promise<Warung[]> => {
    const response = await apiClient<any>('/catalogs?category=warung');
    const rawList = response.data || response;
    if (Array.isArray(rawList)) {
      return rawList.map(mapCatalogToWarung);
    }
    return [];
  },

  getById: async (id: string): Promise<Warung | null> => {
    const response = await apiClient<any>(`/catalogs/${id}`);
    const data = response.data || response;
    if (!data) return null;
    return mapCatalogToWarung(data);
  },

  create: async (data: Omit<Warung, 'id'> | FormData): Promise<Warung> => {
    let body: any;

    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      if (!data.has('category')) {
        data.append('category', 'warung');
      }
      body = data;
    } else {
      const w = data as Omit<Warung, 'id'>;
      body = JSON.stringify({
        category: 'warung',
        name: w.name,
        description: w.description,
        contact_phone: w.whatsapp,
        location_note: w.address,
        operating_hours: formatOperatingHours(w.openingTime, w.closingTime),
        tags: Array.isArray(w.tags) ? w.tags.join(', ') : w.tags,
        status: w.status === 'active' ? 'approved' : 'pending',
        image_url: w.image,
      });
    }

    const response = await apiClient<any>('/catalogs', {
      method: 'POST',
      body,
    });

    const created = response.data || response;
    return mapCatalogToWarung(created);
  },

  update: async (id: string, data: Partial<Warung> | FormData): Promise<Warung> => {
    let body: any;

    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      if (!data.has('category')) {
        data.append('category', 'warung');
      }
      body = data;
    } else {
      const w = data as Partial<Warung>;
      const payload: Record<string, any> = {
        category: 'warung',
      };

      if (w.name !== undefined) payload.name = w.name;
      if (w.description !== undefined) payload.description = w.description;
      if (w.whatsapp !== undefined) payload.contact_phone = w.whatsapp;
      if (w.address !== undefined) payload.location_note = w.address;
      if (w.openingTime !== undefined || w.closingTime !== undefined) {
        payload.operating_hours = formatOperatingHours(w.openingTime, w.closingTime);
      }
      if (w.tags !== undefined) {
        payload.tags = Array.isArray(w.tags) ? w.tags.join(', ') : w.tags;
      }
      if (w.status !== undefined) {
        payload.status = w.status === 'active' ? 'approved' : 'pending';
      }
      if (w.image !== undefined) {
        payload.image_url = w.image;
      }

      body = JSON.stringify(payload);
    }

    const response = await apiClient<any>(`/catalogs/${id}`, {
      method: 'PUT',
      body,
    });

    const updated = response.data || response;
    return mapCatalogToWarung(updated);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient(`/catalogs/${id}`, { method: 'DELETE' });
  },

  toggleStatus: async (id: string): Promise<Warung> => {
    const current = await warungService.getById(id);
    if (!current) throw new Error('Warung tidak ditemukan');

    const nextStatus = current.status === 'active' ? 'pending' : 'approved';

    const response = await apiClient<any>(`/catalogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: nextStatus,
      }),
    });

    const updated = response.data || response;
    return mapCatalogToWarung(updated);
  },
};

// Backwards-compatible aliases
export const getWarungs = warungService.getAll;
export const getWarungById = warungService.getById;
export const createWarung = warungService.create;
export const updateWarung = warungService.update;
export const deleteWarung = warungService.delete;
export const toggleWarungStatus = warungService.toggleStatus;
