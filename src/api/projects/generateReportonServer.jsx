import { apiFetch } from '../api';

export const generateReportonServer = async (url ) => {
    // choose your base path
    const basePath = "/api/projects/generateReport"
        
  
    // build a query string
    const params = new URLSearchParams({ url });
  
    // call apiFetch with the full URL
    return  apiFetch(`${basePath}?${params.toString()}`, {
      method: "GET",
    });
  };
  