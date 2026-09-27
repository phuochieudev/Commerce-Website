import { z } from 'zod';

export const CreateRatingDTOSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  content: z.string().min(1, 'Review content is required'),
});
export type CreateRatingDTO = z.infer<typeof CreateRatingDTOSchema>;

export const UpdateRatingDTOSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  content: z.string().min(1, 'Review content is required'),
});
export type UpdateRatingDTO = z.infer<typeof UpdateRatingDTOSchema>;
