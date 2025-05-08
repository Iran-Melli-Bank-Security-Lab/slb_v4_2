import { apiFetch } from '../api';

export const userNotif = async (userId) => {
    // choose your base path
    const basePath = "/api/notification/user"
    // build a query string
    const params = new URLSearchParams({ userId });
  
    // call apiFetch with the full URL
    return  apiFetch(`${basePath}?${params.toString()}`, {
      method: "GET",
    });
  };
  