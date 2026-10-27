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
