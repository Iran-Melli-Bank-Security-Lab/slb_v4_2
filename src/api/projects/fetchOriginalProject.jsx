import { apiFetch } from '../api';

export const fetchOriginalProject = async (projectId) => {
    // choose your base path
    const basePath ="/api/projects/project/original";
  
    // build a query string
    const params = new URLSearchParams({ projectId  });
  
    // call apiFetch with the full URL
    return  apiFetch(`${basePath}?${params.toString()}`, {
      method: "GET",
    });
    
  };