
import { apiFetch } from '../api';

//authId is the same a manager id because the user is manager when assigne user to project 

  export const getAssignedUsers = async (projectId, userId) => {
    const query = new URLSearchParams({ projectId, userId }).toString();
    return apiFetch(`/api/users/assignedUsers?${query}`, {
      method: "GET",
    });
  };
  