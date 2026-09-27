import { apiClient } from './api';
import { WishlistItem, LikeStatus } from '../types/wishlist';

interface WishlistListResponse {
  data: WishlistItem[];
  paging: { page: number; limit: number; total: number };
}

export const wishlistService = {
  like: async (productId: string) => {
    await apiClient.post(`/products/${productId}/like`);
  },

  unlike: async (productId: string) => {
    await apiClient.delete(`/products/${productId}/like`);
  },

  getStatus: async (productId: string) => {
    const response = await apiClient.get<LikeStatus>(`/products/${productId}/like-status`);
    return response.data;
  },

  getMyWishlist: async (page = 1, limit = 50) => {
    const response = await apiClient.get<WishlistListResponse>('/liked-products', { params: { page, limit } });
    return response.data;
  },
};
