import { apiClient } from './api';
import { User, LoginCredentials, RegisterCredentials } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post<{ token: string; user: User }>('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials) => {
    const response = await apiClient.post<{ token: string; user: User }>('/auth/register', credentials);
    return response.data;
  },

  logout: async () => {
    await apiClient.post('/users/logout');
  },

  getProfile: async () => {
    const response = await apiClient.get<User>('/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await apiClient.patch<User>('/profile', data);
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    await apiClient.post('/profile/change-password', { oldPassword, newPassword });
  },
};
