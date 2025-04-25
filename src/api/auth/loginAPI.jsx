import { apiFetch } from '../api';

export const loginAPI = async (username, password) => {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

export const getProfile = async () => {
  return apiFetch('/api/me'); // GET by default
};