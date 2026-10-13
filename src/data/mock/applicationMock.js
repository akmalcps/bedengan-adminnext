export const initialApplication = [
  {
    id: '1',
    applicantName: 'Budi Santoso',
    businessName: 'Warung Kopi Senja',
    category: 'Warung & Kuliner',
    description: 'Menjual aneka kopi nusantara dan camilan ringan.',
    whatsapp: '08987654321',
    address: 'Area Parkir 2 Bedengan',
    images: ['https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'],
    status: 'Pending',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    rejectionReason: null
  },
  {
    id: '2',
    applicantName: 'Siti Aminah',
    businessName: 'Sewa Tenda Berkah',
    category: 'Rental',
    description: 'Menyewakan tenda dome dan alat masak portable.',
    whatsapp: '08987654322',
    address: 'Jl. Raya Bedengan No. 10',
    images: [],
    status: 'Pending',
    submittedAt: new Date(Date.now() - 43200000).toISOString(),
    rejectionReason: null
  }
];
