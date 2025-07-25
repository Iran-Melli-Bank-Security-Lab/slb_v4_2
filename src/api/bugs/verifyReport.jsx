import { apiFetch } from '../api';

export const verifyReport = async (id , state ) => {
    return apiFetch(`/api/projects/user/report/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id , state  }),
    });
  };