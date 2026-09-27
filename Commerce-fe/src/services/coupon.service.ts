import { apiClient } from './api';
import { Coupon, ValidateCouponResult } from '../types/coupon';

interface CouponListResponse {
  data: Coupon[];
  paging: { page: number; limit: number; total: number };
}

export const couponService = {
  validate: async (code: string, orderTotal: number) => {
    const response = await apiClient.post<ValidateCouponResult>('/coupons/validate', { code, orderTotal });
    return response.data;
  },

  getAll: async (page = 1, limit = 20) => {
    const response = await apiClient.get<CouponListResponse>('/coupons', { params: { page, limit } });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Coupon>(`/coupons/${id}`);
    return response.data;
  },

  create: async (data: Partial<Coupon>) => {
    const response = await apiClient.post<Coupon>('/coupons', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Coupon>) => {
    const response = await apiClient.patch<Coupon>(`/coupons/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/coupons/${id}`);
  },
};
