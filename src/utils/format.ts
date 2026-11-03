export const formatRupiah = (number?: number | string | null): string => {
  if (number === undefined || number === null || number === '') return 'Rp0';
  
  const num = typeof number === 'string' ? parseFloat(number) : number;
  if (isNaN(num)) return 'Rp0';

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Memastikan nilai yang diterima selalu berupa Array string[] aman
 */
export const ensureArray = (val: any): string[] => {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item).trim()).filter(Boolean);
        }
      } catch {
        // Fallback ke pemisahan koma
      }
    }
    return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

/**
 * Menghapus semua karakter non-digit agar input nomor telepon hanya menerima angka
 */
export const sanitizePhoneInput = (value: string): string => {
  return value.replace(/\D/g, '');
};

/**
 * Validasi nomor HP / WhatsApp Indonesia (08xx, 628xx, +628xx)
 */
export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-().]/g, '');
  return /^(\+62|62|0)8[1-9][0-9]{6,11}$/.test(cleaned);
};

/**
 * Format string jam operasional lengkap dengan akhiran WIB
 */
export const formatOperatingHours = (open?: string, close?: string): string => {
  const o = open ? open.trim() : '08:00';
  const c = close ? close.trim() : '17:00';
  return `${o} - ${c} WIB`;
};

/**
 * Memecah string jam buka dari backend ("08:00 - 17:00 WIB" atau "08:00 - 17:00")
 * menjadi objek { openingTime, closingTime }
 */
export const parseOperatingHours = (raw?: string): { openingTime: string; closingTime: string } => {
  const defaultTimes = { openingTime: '08:00', closingTime: '17:00' };
  if (!raw || typeof raw !== 'string') return defaultTimes;

  const parts = raw.split('-');
  if (parts.length >= 2) {
    const open = parts[0].trim();
    const close = parts[1].replace(/WIB/i, '').trim();
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    return {
      openingTime: timeRegex.test(open) ? open : defaultTimes.openingTime,
      closingTime: timeRegex.test(close) ? close : defaultTimes.closingTime,
    };
  }

  return defaultTimes;
};

