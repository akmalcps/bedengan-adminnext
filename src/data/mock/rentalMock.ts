export const initialRental = [
  {
    id: '1',
    name: 'Bedengan Camp Rental',
    description: 'Penyedia perlengkapan camping terlengkap di kawasan Bedengan. Menyewakan berbagai jenis tenda, alat masak, hingga perlengkapan tidur.',
    whatsapp: '081234567893',
    address: 'Pos Penjagaan Bedengan',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    openingTime: '08:00',
    closingTime: '20:00',
    status: 'active',
    updatedAt: new Date().toISOString(),
    items: [
      { id: '101', name: 'Tenda Kapasitas 4 Orang', price: 60000, unit: 'malam', availability: 'tersedia', image: '' },
      { id: '102', name: 'Paket Meja + Kursi', price: 90000, unit: 'paket', availability: 'tersedia', image: '' },
      { id: '103', name: 'Kompor Kotak', price: 25000, unit: 'set', availability: 'tersedia', image: '' },
      { id: '104', name: 'Lampu Tenda', price: 10000, unit: 'pcs', availability: 'tersedia', image: '' }
    ]
  }
];
