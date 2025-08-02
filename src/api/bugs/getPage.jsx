import { apiFetch } from '../api';

//project is project Id 
export const getPage  = async (project) => {
    
    const basePath = "/api/projects/page"

    const params = new URLSearchParams({ project });

    // call apiFetch with the full URL
    return apiFetch(`${basePath}?${params.toString()}`, {
        method: "GET",
    });
};
