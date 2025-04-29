import { apiFetch } from '../api';

export const getUsers = async () => {
    
    // call apiFetch with the full URL
    return apiFetch('/api/users/', {
      method: "GET",
    });
  };
  