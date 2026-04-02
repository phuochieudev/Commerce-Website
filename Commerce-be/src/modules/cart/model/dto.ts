import { z } from 'zod';

export const AddToCartDTOSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  attribute: z.string().min(1, 'Attribute is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});
export type AddToCartDTO = z.infer<typeof AddToCartDTOSchema>;

export const UpdateCartDTOSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});
export type UpdateCartDTO = z.infer<typeof UpdateCartDTOSchema>;
