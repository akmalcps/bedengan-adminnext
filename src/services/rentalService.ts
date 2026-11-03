import { apiClient } from './apiClient';
import { Rental, RentalItemSub } from '@/src/types/rental';
import { CreateRentalPayload, UpdateRentalPayload } from '@/src/types/rental-api';
import { ensureArray, formatOperatingHours, parseOperatingHours } from '@/src/utils/format';

/**
 * Adapter untuk mengubah format database/backend catalog menjadi interface Rental frontend
 */
export const mapCatalogToRental = (item: any): Rental => {
  const { openingTime, closingTime } = parseOperatingHours(item.operating_hours);
  const statusStr = String(item.status || '').toLowerCase();
  const isActive = statusStr === 'approved' || statusStr === 'active';
  const tagsList = ensureArray(item.tags);

  // Inventaris item: jika ada di item.items gunakan itu, jika tidak buat dari tags
  let items: RentalItemSub[] = [];
  if (Array.isArray(item.items) && item.items.length > 0) {
    items = item.items;
  } else if (tagsList.length > 0) {
    items = tagsList.map((tag, idx) => ({
      id: `${item.id}-${idx}`,
      name: tag,
      price: item.price_text || '50000',
      unit: 'hari',
      availability: 'tersedia',
    }));
  }

  return {
    id: String(item.id),
    name: item.name || '',
    description: item.description || '',
    whatsapp: item.contact_phone || item.whatsapp || '',
    address: item.location_note || item.address || '',
    image: item.image_url || item.image || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800',
    openingTime,
    closingTime,
    status: isActive ? 'active' : 'inactive',
    updatedAt: item.updated_at || item.created_at || new Date().toISOString(),
    items,
  };
};

export const rentalService = {
  getAll: async (): Promise<Rental[]> => {
    const response = await apiClient<any>('/catalogs?category=rental');
    const rawList = response.data || response;
    if (Array.isArray(rawList)) {
      return rawList.map(mapCatalogToRental);
    }
    return [];
  },

  getById: async (id: string): Promise<Rental | null> => {
    const response = await apiClient<any>(`/catalogs/${id}`);
    const data = response.data || response;
    if (!data) return null;
    return mapCatalogToRental(data);
  },

  create: async (payload: CreateRentalPayload | FormData): Promise<Rental> => {
    let body: any;

    if (typeof FormData !== 'undefined' && payload instanceof FormData) {
      if (!payload.has('category')) {
        payload.append('category', 'rental');
      }
      body = payload;
    } else {
      const p = payload as CreateRentalPayload;
      const tagNames = (p.items || []).map((it) => it.name).filter(Boolean);
      const priceText = p.items && p.items.length > 0 ? `Mulai ${p.items[0].price}` : 'Mulai Rp 50.000';

      body = JSON.stringify({
        category: 'rental',
        name: p.name,
        description: p.description,
        contact_phone: p.whatsapp,
        location_note: p.address,
        operating_hours: formatOperatingHours(p.openingTime, p.closingTime),
        tags: tagNames.join(', '),
        price_text: priceText,
        status: p.status === 'active' ? 'approved' : 'pending',
        image_url: p.image,
      });
    }

    const response = await apiClient<any>('/catalogs', {
      method: 'POST',
      body,
    });

    const created = response.data || response;
    return mapCatalogToRental(created);
  },

  update: async (id: string, payload: UpdateRentalPayload | FormData): Promise<Rental> => {
    let body: any;

    if (typeof FormData !== 'undefined' && payload instanceof FormData) {
      if (!payload.has('category')) {
        payload.append('category', 'rental');
      }
      body = payload;
    } else {
      const p = payload as UpdateRentalPayload;
      const data: Record<string, any> = {
        category: 'rental',
      };

      if (p.name !== undefined) data.name = p.name;
      if (p.description !== undefined) data.description = p.description;
      if (p.whatsapp !== undefined) data.contact_phone = p.whatsapp;
      if (p.address !== undefined) data.location_note = p.address;
      if (p.openingTime !== undefined || p.closingTime !== undefined) {
        data.operating_hours = formatOperatingHours(p.openingTime, p.closingTime);
      }
      if (p.items !== undefined) {
        const tagNames = p.items.map((it) => it.name).filter(Boolean);
        data.tags = tagNames.join(', ');
        if (p.items.length > 0) {
          data.price_text = `Mulai ${p.items[0].price}`;
        }
      }
      if (p.status !== undefined) {
        data.status = p.status === 'active' ? 'approved' : 'pending';
      }
      if (p.image !== undefined) {
        data.image_url = p.image;
      }

      body = JSON.stringify(data);
    }

    const response = await apiClient<any>(`/catalogs/${id}`, {
      method: 'PUT',
      body,
    });

    const updated = response.data || response;
    return mapCatalogToRental(updated);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient(`/catalogs/${id}`, { method: 'DELETE' });
  },

  toggleStatus: async (id: string): Promise<Rental> => {
    const current = await rentalService.getById(id);
    if (!current) throw new Error('Rental tidak ditemukan');

    const nextStatus = current.status === 'active' ? 'pending' : 'approved';

    const response = await apiClient<any>(`/catalogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: nextStatus,
      }),
    });

    const updated = response.data || response;
    return mapCatalogToRental(updated);
  },
};

// Backwards-compatible aliases
export const getRentals = rentalService.getAll;
export const getRentalById = rentalService.getById;
export const createRental = rentalService.create;
export const updateRental = rentalService.update;
export const deleteRental = rentalService.delete;
export const toggleRentalStatus = rentalService.toggleStatus;
