import { apiFetch } from '../api';

export const getProjects = async (role, userId) => {
    // choose your base path
    const basePath =
      role === "manager"
        ? "/api/projects/manager"
        : "/api/projects/user";
  
    // build a query string
    const params = new URLSearchParams({ userId });
  
    // call apiFetch with the full URL
    return apiFetch(`${basePath}?${params.toString()}`, {
      method: "GET",
    });
  };
  