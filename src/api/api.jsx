// src/lib/api.js

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'; // for Vite or fallback

export async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include', // ✅ for cookies
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}
