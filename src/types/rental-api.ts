import { ApiResponse } from './api';
import { Rental, RentalItemSub } from './rental';

export type GetRentalsResponse = ApiResponse<Rental[]>;
export type GetRentalDetailResponse = ApiResponse<Rental>;

export interface RentalItemPayload {
  name: string;
  image_url?: string | null;
  file_index?: number | null;
  price?: number | string;
  unit?: string;
  availability?: string;
}

export interface CreateRentalPayload {
  name: string;
  description: string;
  whatsapp: string;
  address: string;
  openingTime: string;
  closingTime: string;
  status?: string;
  image?: string;
  items?: (Omit<RentalItemSub, 'id'> | RentalItemSub | RentalItemPayload)[];
}

export interface UpdateRentalPayload extends Partial<CreateRentalPayload> {
  id?: string;
}
