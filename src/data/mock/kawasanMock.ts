export const initialKawasan = Array.from({ length: 13 }, (_, i) => ({
  id: `area-${i + 1}`,
  number: String(i + 1).padStart(2, '0'),
  name: `Area Camping ${String(i + 1).padStart(2, '0')}`,
  description: `Area camping ${i + 1} dengan nuansa pinus yang asri. Cocok untuk keluarga dan rombongan kecil. Dilengkapi dengan akses dekat sungai dan sumber air.`,
  image: 'https://images.unsplash.com/photo-1537565266751-34feee3794b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  status: 'active',
  facilities: ['Toilet Umum', 'Akses Listrik (Terbatas)', 'Tempat Api Unggun'],
  capacity: `${Math.floor(Math.random() * 20) + 10} Tenda`
}));
