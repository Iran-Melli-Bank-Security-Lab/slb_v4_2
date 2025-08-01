import { apiFetch } from '../api';

export const newTicketId = async () => {
    
    // call apiFetch with the full URL
    return apiFetch('/api/ticket/new_id', {
      method: "GET",
    });
  };
  