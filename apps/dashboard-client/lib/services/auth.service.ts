import { apiClient } from '../api-client';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.login(credentials);
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.register(data);
  },

  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint if it exists
      // await apiClient.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
  },

  async getCurrentUser() {
    // This would call /auth/me endpoint
    // For now, we get from localStorage
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
};
