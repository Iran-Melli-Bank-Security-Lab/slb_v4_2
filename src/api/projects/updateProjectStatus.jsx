import { apiFetch } from '../api';

export const updateProjectStatus = async (projectId,userId , newStatus) => {
  return apiFetch('/api/projects/user/update/status', {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      projectId, userId , 
      newStatus,
    })
  });
};