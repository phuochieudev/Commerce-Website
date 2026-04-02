import { z } from 'zod';
import { ModelStatus } from '../../../share/model/base-model';

export const ProductVariantCreateDTOSchema = z.object({
  sku: z.string().min(1).max(100),
  color: z.string().max(50).optional(),
  size: z.string().max(50).optional(),
  price: z.number().min(0),
  salePrice: z.number().min(0).nullable().optional(),
  quantity: z.number().int().min(0).default(0),
  image: z.string().max(500).optional(),
});
export type ProductVariantCreateDTO = z.infer<typeof ProductVariantCreateDTOSchema>;

export const ProductVariantUpdateDTOSchema = z.object({
  sku: z.string().min(1).max(100).optional(),
  color: z.string().max(50).optional(),
  size: z.string().max(50).optional(),
  price: z.number().min(0).optional(),
  salePrice: z.number().min(0).nullable().optional(),
  quantity: z.number().int().min(0).optional(),
  image: z.string().max(500).optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});
export type ProductVariantUpdateDTO = z.infer<typeof ProductVariantUpdateDTOSchema>;

export type ProductVariantCondDTO = {
  productId?: string;
  status?: string;
};
