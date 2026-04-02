import { apiClient } from './api';
import { Product, ProductListResponse } from '../types/product';

export const productService = {
  getAll: async (page = 1, limit = 20) => {
    const response = await apiClient.get<ProductListResponse>('/products', {
      params: { page, limit },
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  search: async (keyword: string, page = 1, limit = 20) => {
    const response = await apiClient.get<ProductListResponse>('/products', {
      params: { name: keyword, page, limit },
    });
    return response.data;
  },

  create: async (data: Partial<Product>) => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Product>) => {
    const response = await apiClient.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/products/${id}`);
  },
};
