import { apiFetch } from '../api';

export const updateProjectStatus = async (projectId, { newStatus, timeWorked = 0 }) => {
  return apiFetch('/api/projects/user/update/status', {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      projectId, 
      newStatus,
      timeWorked // Include the calculated time worked
    })
  });
};