import { apiFetch } from '../api';

export const getTickets = async (userId , page , limit ) => {
    

    const basePath = '/api/ticket'
      const params = new URLSearchParams({ userId , page , limit  });

    // call apiFetch with the full URL
    return apiFetch(`${basePath}?${params.toString()}`, {
        method: "GET",
    });

 
  };
  
  export const getTicket = async(ticketId ) =>{
    
     const basePath = '/api/ticket/byid'
      const params = new URLSearchParams({ ticketId });

    // call apiFetch with the full URL
    return apiFetch(`${basePath}?${params.toString()}`, {
        method: "GET",
    });

  }