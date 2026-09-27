import { apiClient } from './api';
import { Brand } from '../types/brand';

export const brandService = {
  getAll: async (page = 1, limit = 20) => {
    const response = await apiClient.get<{ data: Brand[]; paging: { page: number; limit: number; total: number } }>(
      '/brands',
      { params: { page, limit } }
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Brand>(`/brands/${id}`);
    return response.data;
  },

  create: async (data: Partial<Brand>) => {
    const response = await apiClient.post<Brand>('/brands', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Brand>) => {
    const response = await apiClient.patch<Brand>(`/brands/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/brands/${id}`);
  },
};
