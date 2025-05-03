
import { apiFetch } from '../api';

export const assingUserToProject = async (projectId , pentesterId  , userId , version ) => {
    
    // call apiFetch with the full URL
    return apiFetch('/api/users/assignUser', {
      method: "post",
      body: JSON.stringify({ projectId, pentesterId, userId ,version }),
    });
  };
  