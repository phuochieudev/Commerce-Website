import { z } from 'zod';
import { ModelStatus } from '../../../share/model/base-model';
import { ProductGender } from './product';

export const ProductCreateDTOSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  gender: z.nativeEnum(ProductGender).default(ProductGender.UNISEX),
  images: z.any().nullable().optional(),
  price: z.number().min(0, 'Price must be >= 0'),
  salePrice: z.number().min(0).nullable().optional(),
  colors: z.string().nullable().optional(),
  quantity: z.number().int().min(0, 'Quantity must be >= 0'),
  brandId: z.string().uuid('Invalid brand ID'),
  categoryId: z.string().uuid('Invalid category ID'),
  content: z.string().optional(),
  description: z.string().optional(),
});
export type ProductCreateDTO = z.infer<typeof ProductCreateDTOSchema>;

export const ProductUpdateDTOSchema = z.object({
  name: z.string().min(2).optional(),
  gender: z.nativeEnum(ProductGender).optional(),
  images: z.any().nullable().optional(),
  price: z.number().min(0).optional(),
  salePrice: z.number().min(0).nullable().optional(),
  colors: z.string().nullable().optional(),
  quantity: z.number().int().min(0).optional(),
  brandId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  content: z.string().optional(),
  description: z.string().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
});
export type ProductUpdateDTO = z.infer<typeof ProductUpdateDTOSchema>;

export const ProductSortSchema = z.enum(['newest', 'price_asc', 'price_desc', 'rating_desc']).optional();
export type ProductSort = z.infer<typeof ProductSortSchema>;

export const ProductCondDTOSchema = z.object({
  name: z.string().optional(),
  gender: z.nativeEnum(ProductGender).optional(),
  brandId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  status: z.nativeEnum(ModelStatus).optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  sort: ProductSortSchema,
});
export type ProductCondDTO = z.infer<typeof ProductCondDTOSchema>;
