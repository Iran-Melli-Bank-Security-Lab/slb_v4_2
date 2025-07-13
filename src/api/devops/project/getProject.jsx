import { apiFetch } from '../../api';

export const getDevopsProjects = async (userId) => {
    // choose your base path
    const basePath = "/api/devops/projects"
  
    // build a query string
    const params = new URLSearchParams({ userId });
  
    // call apiFetch with the full URL
    return  apiFetch(`${basePath}?${params.toString()}`, {
      method: "GET",
    });
  };
  