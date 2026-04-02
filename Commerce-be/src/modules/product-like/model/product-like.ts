import { z } from 'zod';

export const modelName = 'ProductLike';

export const ProductLikeSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  createdAt: z.date().nullable().optional(),
});

export type ProductLike = z.infer<typeof ProductLikeSchema>;
