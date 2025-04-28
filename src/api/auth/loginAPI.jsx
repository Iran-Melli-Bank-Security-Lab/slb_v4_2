import { apiFetch } from '../api';

export const loginAPI = async (username, password) => {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};
