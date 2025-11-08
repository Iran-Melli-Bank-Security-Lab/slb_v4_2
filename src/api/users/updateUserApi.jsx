
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const updateUserApi = async ( formData) => {
  const url = `${BASE_URL}/api/users/profile/update`;

  const response = await fetch(url, {
    method:'POST',
    body: formData,  
    credentials: 'include',  // ✅ For cookies/sessions

  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Failed to update profile'
    }));
    throw new Error(error.message);
  }

  return response.json();
};