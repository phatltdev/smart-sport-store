// Cấu hình API endpoint
export const API_BASE_URL = 'https://smart-sport-store.onrender.com/api';

// Các endpoint
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    UPDATE_PROFILE: `${API_BASE_URL}/auth/update-profile`,
  },
} as const;