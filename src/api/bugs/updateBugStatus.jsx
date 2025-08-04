import { apiFetch } from '../api';

export const updateBugStatus = async (projectId , userId , bugId , status , progress) => {
    return apiFetch(`/api/projects/update/bug/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId , userId , bugId , status , progress }),
    });
  };