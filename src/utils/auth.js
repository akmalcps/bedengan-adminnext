import { currentAdmin } from '../data/mock/adminMock';

const AUTH_KEY = 'bedengan_xplore_admin_auth';

export const login = (email, password) => {
  if (typeof window === 'undefined') return false;
  if (email === currentAdmin.email && password === 'admin123') {
    localStorage.setItem(AUTH_KEY, JSON.stringify(currentAdmin));
    return true;
  }
  return false;
};

export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
};

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(AUTH_KEY);
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(AUTH_KEY);
  // Always override with currentAdmin to ensure single source of truth for the mock
  return user ? currentAdmin : null;
};
