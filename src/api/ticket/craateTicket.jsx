const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const creatTicket = async (formData, initialData) => {
  const url = `${BASE_URL}/api/ticket/creat`;
  
  console.log("form Data in line 6 : " , formData , initialData)
  const response = await fetch(url, {
    method: initialData ? 'PUT' : 'POST',
    body: formData,  // FormData is sent as-is (multipart/form-data)
    credentials: 'include',  // ✅ For cookies/sessions
    // ⚠️ Do NOT set Content-Type manually—the browser sets it automatically with boundary
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Failed to submit report'
    }));
    throw new Error(error.message);
  }

  return response.json();
};