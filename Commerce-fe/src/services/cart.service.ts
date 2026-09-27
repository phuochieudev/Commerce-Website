import { apiClient } from './api';
import { CartItem } from '../types/cart';

interface CartListResponse {
  data: CartItem[];
  paging: { page: number; limit: number; total: number };
}

export const cartService = {
  getCart: async () => {
    const response = await apiClient.get<CartListResponse>('/cart', { params: { limit: 100 } });
    return response.data.data;
  },

  addItem: async (productId: string, attribute: string, quantity: number) => {
    const response = await apiClient.post<string>('/cart', { productId, attribute, quantity });
    return response.data;
  },

  updateItem: async (cartItemId: string, quantity: number) => {
    await apiClient.patch(`/cart/${cartItemId}`, { quantity });
  },

  removeItem: async (cartItemId: string) => {
    await apiClient.delete(`/cart/${cartItemId}`);
  },

  clearCart: async (items: CartItem[]) => {
    await Promise.all(items.map((item) => apiClient.delete(`/cart/${item.id}`)));
  },
};
