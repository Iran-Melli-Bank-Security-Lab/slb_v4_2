import { apiFetch } from '../api';

export const setPage  = async (data ) => {
    return apiFetch(`/api/projects/page`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
  };