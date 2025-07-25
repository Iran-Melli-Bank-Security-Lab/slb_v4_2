import { apiFetch } from '../api';

export const fetchReports = async (projectId, userId , projectManager, id) => {
    
    const basePath = "/api/projects/user/report"

    const params = new URLSearchParams({ projectId, userId , projectManager , id  });

    // call apiFetch with the full URL
    return apiFetch(`${basePath}?${params.toString()}`, {
        method: "GET",
    });
};

export const fetchReportById = async (reportId) => {
    
    const basePath = "/api/projects/user/report/byid"

    const params = new URLSearchParams({ reportId });

    // call apiFetch with the full URL
    return apiFetch(`${basePath}?${params.toString()}`, {
        method: "GET",
    });
};
