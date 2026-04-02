import { z } from 'zod';

export const CreateRatingDTOSchema = z.object({
  content: z.string().min(1, 'Review content is required'),
});
export type CreateRatingDTO = z.infer<typeof CreateRatingDTOSchema>;

export const UpdateRatingDTOSchema = z.object({
  content: z.string().min(1, 'Review content is required'),
});
export type UpdateRatingDTO = z.infer<typeof UpdateRatingDTOSchema>;
