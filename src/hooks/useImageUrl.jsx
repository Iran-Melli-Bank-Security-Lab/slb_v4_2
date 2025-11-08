// hooks/useImageUrl.js
import { useMemo } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const useImageUrl = (imagePath) => {
  return useMemo(() => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/')) {
      return `${BASE_URL}${imagePath}`;
    }
    
    return `${BASE_URL}/${imagePath}`;
  }, [imagePath]);
};