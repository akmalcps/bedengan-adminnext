import { apiClient } from './apiClient';
import { Kawasan } from '@/src/types/kawasan';
import { ensureArray } from '@/src/utils/format';

/**
 * Adapter untuk mengubah format database/backend ground menjadi interface Kawasan frontend
 */
export const mapGroundToKawasan = (g: any): Kawasan => {
  const isActive = Boolean(g.is_active);

  let facilities: string[] = [];
  if (Array.isArray(g.facilities) && g.facilities.length > 0) {
    facilities = g.facilities;
  } else {
    const nearby = g.specs?.nearby_facility || g.nearby_facility;
    const terrain = g.specs?.terrain_feature || g.terrain_feature;
    const toilet = g.specs?.toilet_distance || g.toilet_distance;
    facilities = [nearby, terrain, toilet].filter(Boolean);
  }

  return {
    id: String(g.id),
    number: g.code || '',
    name: g.name || '',
    description: g.description || '',
    image: g.image_url || g.image || 'https://images.unsplash.com/photo-1537565266751-34feee3794b6?w=800',
    status: isActive ? 'active' : 'inactive',
    facilities: ensureArray(facilities),
    capacity: g.capacity_badge || g.capacity || 'Kapasitas: Standar',
  };
};

export const kawasanService = {
  getAll: async (): Promise<Kawasan[]> => {
    const response = await apiClient<any>('/grounds');
    const data = response.data || response;
    const groundsList = Array.isArray(data) ? data : data?.grounds;

    if (Array.isArray(groundsList)) {
      return groundsList.map(mapGroundToKawasan);
    }
    return [];
  },

  getById: async (id: string): Promise<Kawasan | null> => {
    const response = await apiClient<any>(`/grounds/${id}`);
    const data = response.data || response;
    if (!data) return null;
    return mapGroundToKawasan(data);
  },

  update: async (id: string, data: Partial<Kawasan> | FormData): Promise<Kawasan> => {
    let body: any;

    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      body = data;
    } else {
      const k = data as Partial<Kawasan>;
      const payload: Record<string, any> = {};

      if (k.number !== undefined) payload.code = k.number;
      if (k.name !== undefined) payload.name = k.name;
      if (k.capacity !== undefined) payload.capacity_badge = k.capacity;
      if (k.description !== undefined) payload.description = k.description;
      if (k.status !== undefined) payload.is_active = k.status === 'active' ? 1 : 0;
      if (k.image !== undefined) payload.image_url = k.image;

      if (k.facilities && Array.isArray(k.facilities)) {
        if (k.facilities[0]) payload.nearby_facility = k.facilities[0];
        if (k.facilities[1]) payload.terrain_feature = k.facilities[1];
        if (k.facilities[2]) payload.toilet_distance = k.facilities[2];
      }

      body = JSON.stringify(payload);
    }

    const response = await apiClient<any>(`/grounds/${id}`, {
      method: 'PUT',
      body,
    });

    const updated = response.data || response;
    return mapGroundToKawasan(updated);
  },

  toggleStatus: async (id: string): Promise<Kawasan> => {
    const current = await kawasanService.getById(id);
    if (!current) throw new Error('Kawasan tidak ditemukan');

    const nextIsActive = current.status === 'active' ? 0 : 1;

    const response = await apiClient<any>(`/grounds/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        is_active: nextIsActive,
      }),
    });

    const updated = response.data || response;
    return mapGroundToKawasan(updated);
  },
};

// Backwards-compatible aliases
export const getKawasans = kawasanService.getAll;
export const getKawasanById = kawasanService.getById;
export const updateKawasan = kawasanService.update;
export const toggleKawasanStatus = kawasanService.toggleStatus;
