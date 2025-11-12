// hooks/useBaseUrl.js
import { useMemo } from 'react';

const DEFAULT_BASE_URL = 'http://localhost:5173';

export const useBaseUrl = () => {
  return useMemo(() => {
    return import.meta.env.VITE_FRONT_URL || DEFAULT_BASE_URL;
  }, []);
};
