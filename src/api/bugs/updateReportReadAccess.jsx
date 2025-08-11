import { apiFetch } from '../api';

export const updateReportReadAccess = async (reportId , userIds  ) => {
    return apiFetch(`/api/projects/update/bug/readaccess`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reportId , userIds  }),
    });
  };