import { apiFetch } from '../api';

export const fetchProjectById = async (projectId, manager ) => {
    // choose your base path
    const basePath ="/api/projects/project";
  
    // build a query string
    const params = new URLSearchParams({ projectId , manager  });
  
    // call apiFetch with the full URL
    return  apiFetch(`${basePath}?${params.toString()}`, {
      method: "GET",
    });
  };
  