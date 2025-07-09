import { apiFetch } from '../api';

export const getBugs = async (projectId, userId) => {
    
    const basePath = "/api/projects/bugs"

    const params = new URLSearchParams({ projectId, userId });

    // call apiFetch with the full URL
    return apiFetch(`${basePath}?${params.toString()}`, {
        method: "GET",
    });
};
