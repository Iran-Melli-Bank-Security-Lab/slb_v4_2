import { apiFetch } from '../api';

export const getComments = async (ticketId  ) => {
    

    const basePath = '/api/ticket/comment'
      const params = new URLSearchParams({ ticketId });

    // call apiFetch with the full URL
    return apiFetch(`${basePath}?${params.toString()}`, {
        method: "GET",
    });

 
  };