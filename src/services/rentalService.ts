import { apiClient } from './apiClient';
import { Rental } from '@/src/types/rental';
import { CreateRentalPayload, UpdateRentalPayload } from '@/src/types/rental-api';
import { initialRental } from '@/src/data/mock/rentalMock';

const STORAGE_KEY = 'bedengan_xplore_admin_rentals';

const getLocalRentals = (): Rental[] => {
  if (typeof window === 'undefined') return initialRental as unknown as Rental[];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRental));
    return initialRental as unknown as Rental[];
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initialRental as unknown as Rental[];
  }
};

const saveLocalRentals = (rentals: Rental[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rentals));
  }
};

export const rentalService = {
  getAll: async (): Promise<Rental[]> => {
    try {
      const response = await apiClient<any>('/rentals');
      const data = response.data || response;
      if (Array.isArray(data)) {
        return data;
      }
      return getLocalRentals();
    } catch (error) {
      console.warn('Gagal memuat data rental dari backend, menggunakan data lokal:', error);
      return getLocalRentals();
    }
  },

  getById: async (id: string): Promise<Rental | null> => {
    try {
      const response = await apiClient<any>(`/rentals/${id}`);
      return response.data || response || null;
    } catch {
      const local = getLocalRentals();
      return local.find((r) => String(r.id) === String(id)) || null;
    }
  },

  create: async (payload: CreateRentalPayload): Promise<Rental> => {
    try {
      const response = await apiClient<any>('/rentals', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return response.data || response;
    } catch (error) {
      console.warn('Gagal simpan ke backend, menyimpan secara lokal:', error);
      const local = getLocalRentals();
      const newRental: Rental = {
        name: payload.name,
        description: payload.description,
        whatsapp: payload.whatsapp,
        address: payload.address,
        openingTime: payload.openingTime,
        closingTime: payload.closingTime,
        id: Date.now().toString(),
        status: payload.status || 'active',
        image: payload.image || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800',
        updatedAt: new Date().toISOString(),
        items: (payload.items || []).map((item, idx) => ({
          ...item,
          id: 'id' in item && typeof item.id === 'string' && item.id ? item.id : `${Date.now()}-${idx}`,
        })),
      };
      saveLocalRentals([...local, newRental]);
      return newRental;
    }
  },

  update: async (id: string, payload: UpdateRentalPayload): Promise<Rental> => {
    try {
      const response = await apiClient<any>(`/rentals/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      return response.data || response;
    } catch (error) {
      console.warn('Gagal update di backend, mengupdate secara lokal:', error);
      const local = getLocalRentals();
      const index = local.findIndex((r) => String(r.id) === String(id));
      if (index !== -1) {
        const updatedItems = payload.items
          ? payload.items.map((item, idx) => ({
              ...item,
              id: 'id' in item && typeof item.id === 'string' && item.id ? item.id : `${Date.now()}-${idx}`,
            }))
          : local[index].items;

        local[index] = {
          ...local[index],
          ...payload,
          items: updatedItems,
          updatedAt: new Date().toISOString(),
        };
        saveLocalRentals(local);
        return local[index];
      }
      throw new Error('Rental tidak ditemukan');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await apiClient(`/rentals/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.warn('Gagal hapus di backend, menghapus secara lokal:', error);
    }
    const local = getLocalRentals();
    saveLocalRentals(local.filter((r) => String(r.id) !== String(id)));
  },

  toggleStatus: async (id: string): Promise<Rental> => {
    const local = getLocalRentals();
    const index = local.findIndex((r) => String(r.id) === String(id));
    if (index === -1) throw new Error('Rental tidak ditemukan');

    const nextStatus = local[index].status === 'active' ? 'inactive' : 'active';
    try {
      const response = await apiClient<any>(`/rentals/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      return response.data || response;
    } catch {
      local[index].status = nextStatus;
      local[index].updatedAt = new Date().toISOString();
      saveLocalRentals(local);
      return local[index];
    }
  },
};

// Backwards-compatible aliases
export const getRentals = rentalService.getAll;
export const getRentalById = rentalService.getById;
export const createRental = rentalService.create;
export const updateRental = rentalService.update;
export const deleteRental = rentalService.delete;
export const toggleRentalStatus = rentalService.toggleStatus;
