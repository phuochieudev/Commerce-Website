import { z } from 'zod';
import { ModelStatus } from '../../../share/model/base-model';

export const modelName = 'Product';

export enum ProductGender {
  MALE = 'male',
  FEMALE = 'female',
  UNISEX = 'unisex',
}

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  gender: z.nativeEnum(ProductGender),
  images: z.any().nullable().optional(),
  price: z.number().min(0),
  salePrice: z.number().min(0).nullable().optional(),
  colors: z.string().nullable().optional(),
  quantity: z.number().int().min(0),
  brandId: z.string().uuid(),
  categoryId: z.string().uuid(),
  content: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  rating: z.number().min(0).max(5).default(0),
  saleCount: z.number().int().min(0).default(0),
  status: z.nativeEnum(ModelStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Product = z.infer<typeof ProductSchema>;
