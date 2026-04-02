import { z } from 'zod';
import { ModelStatus } from '../../../share/model/base-model';

export const modelName = 'ProductVariant';

export const ProductVariantSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  sku: z.string(),
  color: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  price: z.number().min(0),
  salePrice: z.number().min(0).nullable().optional(),
  quantity: z.number().int().min(0).default(0),
  image: z.string().nullable().optional(),
  status: z.nativeEnum(ModelStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ProductVariant = z.infer<typeof ProductVariantSchema>;
