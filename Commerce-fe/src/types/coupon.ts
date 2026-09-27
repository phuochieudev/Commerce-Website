import { BaseEntity } from './common';

export type CouponType = 'percent' | 'fixed';

export interface Coupon extends BaseEntity {
  code: string;
  description?: string | null;
  type: CouponType;
  value: number;
  minOrderValue: number;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usageCount: number;
  startDate: string;
  endDate: string;
}

export interface ValidateCouponResult {
  coupon: Coupon;
  discountAmount: number;
}
