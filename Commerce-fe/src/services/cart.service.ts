import { apiClient } from './api';
import { Cart, CartItem } from '../types/cart';

export const cartService = {
  getCart: async () => {
    const response = await apiClient.get<Cart>('/carts');
    return response.data;
  },

  addItem: async (productId: string, quantity: number, variantId?: string) => {
    const response = await apiClient.post<Cart>('/cart-items', {
      productId,
      quantity,
      variantId,
    });
    return response.data;
  },

  updateItem: async (cartItemId: string, quantity: number) => {
    const response = await apiClient.patch<CartItem>(`/cart-items/${cartItemId}`, {
      quantity,
    });
    return response.data;
  },

  removeItem: async (cartItemId: string) => {
    await apiClient.delete(`/cart-items/${cartItemId}`);
  },

  clearCart: async () => {
    await apiClient.delete('/carts');
  },
};
