export const initialFotografer = [
  {
    id: '1',
    name: 'The Prime Photography',
    instagramUsername: '@theprimephotography',
    instagramUrl: 'https://instagram.com/theprimephotography',
    whatsapp: '081234567894',
    location: 'Malang Raya',
    description: 'Spesialis wedding, prewedding, dan event photography dengan nuansa cinematic dan natural. Berpengalaman di area Bedengan.',
    profileImage: 'https://images.unsplash.com/photo-1554046920-90dcac470126?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
    ],
    services: [
      { id: '101', name: 'Prewedding', description: 'Sesi prewedding 4 jam', startingPrice: 1500000, status: 'active' },
      { id: '102', name: 'Wedding', description: 'Liputan akad & resepsi full day', startingPrice: 3500000, status: 'active' }
    ],
    status: 'active',
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Alan Picture',
    instagramUsername: '@alanpicture.id',
    instagramUrl: 'https://instagram.com/alanpicture.id',
    whatsapp: '081234567895',
    location: 'Malang Raya',
    description: 'Menangkap momen kebahagiaan Anda. Tersedia layanan photoshoot couple, family, dan group di Bedengan.',
    profileImage: 'https://images.unsplash.com/photo-1544168190-79c154273140?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1520625345719-75508a8f89e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
    ],
    services: [
      { id: '201', name: 'Couple Session', description: 'Sesi couple / portrait santai', startingPrice: 500000, status: 'active' },
      { id: '202', name: 'Family Group', description: 'Sesi foto keluarga maks 10 orang', startingPrice: 750000, status: 'active' }
    ],
    status: 'active',
    updatedAt: new Date().toISOString()
  }
];
