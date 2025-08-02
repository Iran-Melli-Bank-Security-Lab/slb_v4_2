import { apiFetch } from '../api';
  
  
  
  export const getDevOpsInfo= async(projectId , userId )=>{

      const basePath = "/api/devops/info"
  
    // build a query string
    const params = new URLSearchParams({ projectId , userId });
  
    // call apiFetch with the full URL
    return  apiFetch(`${basePath}?${params.toString()}`, {
      method: "GET",
    });


  }