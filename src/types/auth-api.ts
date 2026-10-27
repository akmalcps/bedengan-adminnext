import { AdminUser } from './auth';
import { ApiResponse } from './api';

export interface LoginPayload {
  email?: string;
  username?: string;
  password?: string;
}

export interface LoginResponseData {
  token: string;
  user: AdminUser;
}

export type LoginResponse = ApiResponse<LoginResponseData>;
