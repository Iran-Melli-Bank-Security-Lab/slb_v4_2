
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const registerUserApi = async (formData) => {
  const url = `${BASE_URL}/api/auth/register`;
  
  const response = await fetch(url, {
    method:'POST',
    body: formData,  
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Failed to Register'
    }));
    throw new Error(error.message);
  }

  return response.json();
};