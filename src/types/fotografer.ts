export interface FotograferServiceItem {
  id: string;
  name: string;
  description: string;
  startingPrice: number | string;
  status: 'active' | 'inactive' | string;
}

export interface Fotografer {
  id: string;
  name: string;
  instagramUsername: string;
  instagramUrl: string;
  whatsapp: string;
  location: string;
  description: string;
  profileImage: string;
  gallery: string[];
  services: FotograferServiceItem[];
  status: 'active' | 'inactive' | string;
  updatedAt?: string;
}
