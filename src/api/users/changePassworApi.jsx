import { apiFetch } from '../api';

export const changePasswordApi = async (formData ) => {
    
    // call apiFetch with the full URL
    return apiFetch('/api/auth/change-password', {
      method: "POST",
      body: JSON.stringify({formData}),
    });
  };
  