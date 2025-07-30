import { apiFetch } from '../api';

export const getAllBugsForReport = async (projectId) => {
    
    const basePath = "/api/projects/all/user/reports"

    const params = new URLSearchParams({ projectId });

    // call apiFetch with the full URL
    return apiFetch(`${basePath}?${params.toString()}`, {
        method: "GET",
    });
};