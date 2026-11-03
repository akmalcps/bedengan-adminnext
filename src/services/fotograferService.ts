import { apiClient } from './apiClient';
import { Fotografer, FotograferServiceItem } from '@/src/types/fotografer';
import { ensureArray } from '@/src/utils/format';

/**
 * Adapter untuk mengubah format database/backend catalog menjadi interface Fotografer frontend
 */
export const mapCatalogToFotografer = (item: any): Fotografer => {
  const statusStr = String(item.status || '').toLowerCase();
  const isActive = statusStr === 'approved' || statusStr === 'active';
  const tagsList = ensureArray(item.tags);
  const handle = item.social_handle || '@bedengan.photo';
  const cleanHandle = handle.replace(/^@/, '');

  let services: FotograferServiceItem[] = [];
  if (Array.isArray(item.services) && item.services.length > 0) {
    services = item.services;
  } else if (tagsList.length > 0) {
    services = tagsList.map((tag, idx) => ({
      id: `${item.id}-${idx}`,
      name: `Paket ${tag}`,
      description: item.description || 'Layanan pemotretan outdoor Bedengan.',
      startingPrice: item.price_text || '150000',
      status: 'active',
    }));
  }

  const mainImage = item.image_url || item.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';

  return {
    id: String(item.id),
    name: item.name || '',
    instagramUsername: handle,
    instagramUrl: `https://instagram.com/${cleanHandle}`,
    whatsapp: item.contact_phone || item.whatsapp || '',
    location: item.location_note || item.location || 'Malang Raya',
    description: item.description || '',
    profileImage: mainImage,
    gallery: Array.isArray(item.gallery) && item.gallery.length > 0 ? item.gallery : [mainImage],
    services,
    status: isActive ? 'active' : 'inactive',
    updatedAt: item.updated_at || item.created_at || new Date().toISOString(),
  };
};

export const fotograferService = {
  getAll: async (): Promise<Fotografer[]> => {
    const response = await apiClient<any>('/catalogs?category=photographer');
    const rawList = response.data || response;
    if (Array.isArray(rawList)) {
      return rawList.map(mapCatalogToFotografer);
    }
    return [];
  },

  getById: async (id: string): Promise<Fotografer | null> => {
    const response = await apiClient<any>(`/catalogs/${id}`);
    const data = response.data || response;
    if (!data) return null;
    return mapCatalogToFotografer(data);
  },

  create: async (data: Omit<Fotografer, 'id'> | FormData): Promise<Fotografer> => {
    let body: any;

    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      if (!data.has('category')) {
        data.append('category', 'photographer');
      }
      body = data;
    } else {
      const f = data as Omit<Fotografer, 'id'>;
      const serviceNames = (f.services || []).map((s) => s.name).filter(Boolean);
      const startingPrice = f.services && f.services.length > 0 ? `Mulai ${f.services[0].startingPrice}` : 'Mulai Rp 150.000';

      body = JSON.stringify({
        category: 'photographer',
        name: f.name,
        description: f.description,
        contact_phone: f.whatsapp,
        location_note: f.location,
        social_handle: f.instagramUsername,
        tags: serviceNames.join(', '),
        price_text: startingPrice,
        status: f.status === 'active' ? 'approved' : 'pending',
        image_url: f.profileImage,
      });
    }

    const response = await apiClient<any>('/catalogs', {
      method: 'POST',
      body,
    });

    const created = response.data || response;
    return mapCatalogToFotografer(created);
  },

  update: async (id: string, data: Partial<Fotografer> | FormData): Promise<Fotografer> => {
    let body: any;

    if (typeof FormData !== 'undefined' && data instanceof FormData) {
      if (!data.has('category')) {
        data.append('category', 'photographer');
      }
      body = data;
    } else {
      const f = data as Partial<Fotografer>;
      const payload: Record<string, any> = {
        category: 'photographer',
      };

      if (f.name !== undefined) payload.name = f.name;
      if (f.description !== undefined) payload.description = f.description;
      if (f.whatsapp !== undefined) payload.contact_phone = f.whatsapp;
      if (f.location !== undefined) payload.location_note = f.location;
      if (f.instagramUsername !== undefined) payload.social_handle = f.instagramUsername;
      if (f.services !== undefined) {
        const names = f.services.map((s) => s.name).filter(Boolean);
        payload.tags = names.join(', ');
        if (f.services.length > 0) {
          payload.price_text = `Mulai ${f.services[0].startingPrice}`;
        }
      }
      if (f.status !== undefined) {
        payload.status = f.status === 'active' ? 'approved' : 'pending';
      }
      if (f.profileImage !== undefined) {
        payload.image_url = f.profileImage;
      }

      body = JSON.stringify(payload);
    }

    const response = await apiClient<any>(`/catalogs/${id}`, {
      method: 'PUT',
      body,
    });

    const updated = response.data || response;
    return mapCatalogToFotografer(updated);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient(`/catalogs/${id}`, { method: 'DELETE' });
  },

  toggleStatus: async (id: string): Promise<Fotografer> => {
    const current = await fotograferService.getById(id);
    if (!current) throw new Error('Fotografer tidak ditemukan');

    const nextStatus = current.status === 'active' ? 'pending' : 'approved';

    const response = await apiClient<any>(`/catalogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: nextStatus,
      }),
    });

    const updated = response.data || response;
    return mapCatalogToFotografer(updated);
  },
};

// Backwards-compatible aliases
export const getFotografers = fotograferService.getAll;
export const getFotograferById = fotograferService.getById;
export const createFotografer = fotograferService.create;
export const updateFotografer = fotograferService.update;
export const deleteFotografer = fotograferService.delete;
export const toggleFotograferStatus = fotograferService.toggleStatus;
