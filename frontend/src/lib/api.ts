import axios from 'axios';
import { UserCreate, UserLogin, UserResponse, TokenResponse } from '@/types/user';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  // Đăng ký tài khoản mới
  async register(userData: UserCreate): Promise<UserResponse> {
    const response = await apiClient.post<UserResponse>('/api/auth/register', userData);
    return response.data;
  },

  // Đăng nhập
  async login(userData: UserLogin): Promise<TokenResponse> {
    const response = await apiClient.post<TokenResponse>('/api/auth/login', userData);
    return response.data;
  },
};

export default apiClient;