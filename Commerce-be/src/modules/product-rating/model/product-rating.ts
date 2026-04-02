import { z } from 'zod';

export const modelName = 'ProductRating';

export const ProductRatingSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  content: z.string().nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updated: z.date().nullable().optional(),
});

export type ProductRating = z.infer<typeof ProductRatingSchema>;
