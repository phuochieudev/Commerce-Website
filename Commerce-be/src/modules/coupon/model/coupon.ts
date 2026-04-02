import { z } from 'zod';
import { ModelStatus } from '../../../share/model/base-model';

export const modelName = 'Coupon';

export enum CouponType {
  PERCENT = 'percent',
  FIXED = 'fixed',
}

export const CouponSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  description: z.string().nullable().optional(),
  type: z.nativeEnum(CouponType),
  value: z.number().min(0),
  minOrderValue: z.number().min(0).default(0),
  maxDiscount: z.number().min(0).nullable().optional(),
  usageLimit: z.number().int().nullable().optional(),
  usageCount: z.number().int().default(0),
  startDate: z.date(),
  endDate: z.date(),
  status: z.nativeEnum(ModelStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Coupon = z.infer<typeof CouponSchema>;
