import { apiClient } from './api';
import { Order } from '../types/order';

export const orderService = {
  getAll: async (page = 1, limit = 10) => {
    const response = await apiClient.get<{ data: Order[]; total: number }>('/orders', {
      params: { page, limit },
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  create: async (data: Partial<Order>) => {
    const response = await apiClient.post<Order>('/orders', data);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await apiClient.patch<Order>(`/orders/${id}`, { status });
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await apiClient.patch<Order>(`/orders/${id}`, { status: 'cancelled' });
    return response.data;
  },
};
