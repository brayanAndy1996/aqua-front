import axios from 'axios';
import { LoginCredentials, LoginResponse, RegisterCredentials } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      console.error("🚀 ~ login ~ error:", error)
      throw error;
    }
  },
  register: async (credentials: RegisterCredentials): Promise<LoginResponse> => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, credentials);
      return response.data;
    } catch (error) {
      console.error("🚀 ~ register ~ error:", error)
      throw error;
    }
  },
};
