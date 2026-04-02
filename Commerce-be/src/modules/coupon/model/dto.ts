import { z } from 'zod';
import { ModelStatus } from '../../../share/model/base-model';
import { CouponType } from './coupon';

export const CouponCreateDTOSchema = z.object({
  code: z.string().min(3, 'Coupon code must be at least 3 characters').max(50),
  description: z.string().max(255).optional(),
  type: z.nativeEnum(CouponType),
  value: z.number().min(0, 'Value must be >= 0'),
  minOrderValue: z.number().min(0).default(0),
  maxDiscount: z.number().min(0).nullable().optional(),
  usageLimit: z.number().int().min(1).nullable().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});
export type CouponCreateDTO = z.infer<typeof CouponCreateDTOSchema>;

export const CouponUpdateDTOSchema = z.object({
  description: z.string().max(255).optional(),
  type: z.nativeEnum(CouponType).optional(),
  value: z.number().min(0).optional(),
  minOrderValue: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).nullable().optional(),
  usageLimit: z.number().int().min(1).nullable().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});
export type CouponUpdateDTO = z.infer<typeof CouponUpdateDTOSchema>;

export type CouponCondDTO = {
  code?: string;
  status?: string;
};
