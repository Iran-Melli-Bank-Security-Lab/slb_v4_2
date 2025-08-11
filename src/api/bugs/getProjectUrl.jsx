import { apiFetch } from '../api';

export const getProjectUrl = async(projectId ) =>{
 const basePath = "/api/devops/endpoint/url"

    const params = new URLSearchParams({ projectId });

    // call apiFetch with the full URL
    return apiFetch(`${basePath}?${params.toString()}`, {
        method: "GET",
    });
}