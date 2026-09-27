import { apiClient } from './api';
import { UserAddress } from '../types/address';

export const addressService = {
  getAll: async () => {
    const response = await apiClient.get<UserAddress[]>('/addresses');
    return response.data;
  },

  create: async (data: Partial<UserAddress>) => {
    const response = await apiClient.post<UserAddress>('/addresses', data);
    return response.data;
  },

  update: async (id: string, data: Partial<UserAddress>) => {
    const response = await apiClient.patch<UserAddress>(`/addresses/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/addresses/${id}`);
  },

  setDefault: async (id: string) => {
    await apiClient.patch(`/addresses/${id}/default`);
  },
};
