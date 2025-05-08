import { apiFetch } from '../api';

export const setSeenNotif = async (notifId) => {
    return apiFetch(`/api/notification/seen`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notifId }),
    });
  };
  