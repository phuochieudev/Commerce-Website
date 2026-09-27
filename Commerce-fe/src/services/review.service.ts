import { apiClient } from './api';
import { Review, ReviewListResponse } from '../types/review';

export const reviewService = {
  list: async (productId: string, page = 1, limit = 20) => {
    const response = await apiClient.get<ReviewListResponse>(`/products/${productId}/ratings`, {
      params: { page, limit },
    });
    return response.data;
  },

  create: async (productId: string, rating: number, content: string) => {
    await apiClient.post(`/products/${productId}/ratings`, { rating, content });
  },

  update: async (productId: string, rating: number, content: string) => {
    await apiClient.patch(`/products/${productId}/ratings`, { rating, content });
  },

  delete: async (productId: string) => {
    await apiClient.delete(`/products/${productId}/ratings`);
  },
};

export type { Review };
