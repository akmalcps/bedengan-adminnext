import { ApiResponse } from './api';
import { Rental, RentalItemSub } from './rental';

export type GetRentalsResponse = ApiResponse<Rental[]>;
export type GetRentalDetailResponse = ApiResponse<Rental>;

export interface CreateRentalPayload {
  name: string;
  description: string;
  whatsapp: string;
  address: string;
  openingTime: string;
  closingTime: string;
  status?: string;
  image?: string;
  items?: Omit<RentalItemSub, 'id'>[] | RentalItemSub[];
}

export interface UpdateRentalPayload extends Partial<CreateRentalPayload> {
  id?: string;
}
