export interface RentalItemSub {
  id: string;
  name: string;
  price: number | string;
  unit: string;
  availability: 'tersedia' | 'habis' | string;
  image?: string;
}

export interface Rental {
  id: string;
  name: string;
  description: string;
  whatsapp: string;
  address: string;
  image: string;
  openingTime: string;
  closingTime: string;
  status: 'active' | 'inactive' | string;
  updatedAt?: string;
  items?: RentalItemSub[];
}

export type RentalStatus = 'active' | 'inactive';
