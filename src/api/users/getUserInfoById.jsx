import { apiFetch } from '../api';

export const getUserInfoById = async ( userId  ) => {
        
    const query = new URLSearchParams({  userId  }).toString();
    return apiFetch(`/api/users/userinfo?${query}`, {
      method: "GET",
    });
  };