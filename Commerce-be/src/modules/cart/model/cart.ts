import { z } from 'zod';

export const modelName = 'Cart';

export const CartSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  productId: z.string().uuid(),
  attribute: z.string().min(1),
  quantity: z.number().int().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Cart = z.infer<typeof CartSchema>;
