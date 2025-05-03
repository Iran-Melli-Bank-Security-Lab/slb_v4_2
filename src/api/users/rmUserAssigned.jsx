import { apiFetch } from '../api';

export const rmUserAssigned = async (projectId , pentesterId  , userId ) => {
    
    // call apiFetch with the full URL
    return apiFetch('/api/users/rmuserassigned', {
      method: "DELETE",
      body: JSON.stringify({ projectId, pentesterId, userId }),
    });
  };
  