import { apiFetch } from '../../api';
  
  
  
  export const getOwaspItem= async(id)=>{

      const basePath = "/api/owasp/impact"
  
    // build a query string
    const params = new URLSearchParams({id});
  
    // call apiFetch with the full URL
    return  apiFetch(`${basePath}?${params.toString()}`, {
      method: "GET",
    });


  }