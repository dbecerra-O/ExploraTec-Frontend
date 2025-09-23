import api from './config';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export const authService = {
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      await api.post('/auth/register', userData);

      const loginRes = await api.post<AuthResponse>('/auth/login', {
        username: userData.username,
        password: userData.password
      });

      const data = loginRes.data;

      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new CustomEvent('authChange'));
      }

      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Error en el registro');
    }
  },

  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', credentials);

    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      if (response.data.user) localStorage.setItem('user', JSON.stringify(response.data.user));
      window.dispatchEvent(new CustomEvent('authChange'));
    }

    return response.data;
  } catch (error: any) {
    throw error;
  }
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.dispatchEvent(new CustomEvent('authChange'));
  },

  // Obtener usuario actual
  getCurrentUser: (): User | null => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  },

  // Verificar si está autenticado
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('access_token');
    return !!token;
  },

  // Obtener token
  getToken: (): string | null => {
    return localStorage.getItem('access_token');
  }
};