export interface AdminUser {
  id?: string;
  name: string;
  email: string;
  role: string;
  initials?: string;
  avatar?: string;
}

export interface AuthSession {
  token: string;
  user: AdminUser;
}
