import { apiClient } from './api';
import { CreateOrderInput, Order, OrderListResponse, OrderStatus, PaymentStatus } from '../types/order';

export const orderService = {
  getAll: async (page = 1, limit = 10) => {
    const response = await apiClient.get<OrderListResponse>('/orders', { params: { page, limit } });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  // Returns the new order's id (the backend does not echo back the full Order)
  create: async (data: CreateOrderInput) => {
    const response = await apiClient.post<string>('/orders', data);
    return response.data;
  },

  updateStatus: async (id: string, status: OrderStatus, paymentStatus?: PaymentStatus, trackingNumber?: string) => {
    await apiClient.patch<boolean>(`/orders/${id}/status`, { status, paymentStatus, trackingNumber });
  },

  cancel: async (id: string) => {
    await apiClient.patch<boolean>(`/orders/${id}/cancel`);
  },
};
