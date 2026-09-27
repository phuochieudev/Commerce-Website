import { apiClient } from './api';
import { DashboardStats } from '../types/admin';

export const adminService = {
  getStats: async () => {
    const response = await apiClient.get<DashboardStats>('/admin/stats');
    return response.data;
  },
};
