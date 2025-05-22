
import { apiFetch } from '../api';


  export const getBugScopes = async (projectId, userId , managerId ) => {
    const query = new URLSearchParams({ projectId, userId , managerId  }).toString();
    return apiFetch(`/api/users/bugscopes?${query}`, {
      method: "GET",
    });
  };