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

export const fetchAllUserReports = async (projectId, userId ) => {
    
    const basePath = "/api/projects/reports/user/all"

    const params = new URLSearchParams({ projectId , userId    });

    // call apiFetch with the full URL
    return apiFetch(`${basePath}?${params.toString()}`, {
        method: "GET",
    });
};
