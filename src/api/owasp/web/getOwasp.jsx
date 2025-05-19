import { apiFetch } from '../../api';

export const getOwasp = async () => {
  
    return  apiFetch(`/api/owasp/web`, {
      method: "GET",
    });
  };
  