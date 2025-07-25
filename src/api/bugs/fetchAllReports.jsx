// this is used in ProjectReport.jsx page 
import { apiFetch } from '../api';

export const fetchAllReports = async (projectId, projectManager) => {
    
    const basePath = "/api/projects/reports/all/users"

    const params = new URLSearchParams({ projectId , projectManager   });

    // call apiFetch with the full URL
    return apiFetch(`${basePath}?${params.toString()}`, {
        method: "GET",
    });
};
