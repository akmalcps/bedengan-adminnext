export interface Warung {
  id: string;
  name: string;
  description: string;
  whatsapp: string;
  address: string;
  image: string;
  openingTime: string;
  closingTime: string;
  tags: string[];
  status: 'active' | 'inactive' | string;
  updatedAt?: string;
}
