import { apiFetch } from '../api';

export const deleteReportById = async (reportId) => {
    return apiFetch(`/api/projects/user/report/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({reportId}),
    });
  };