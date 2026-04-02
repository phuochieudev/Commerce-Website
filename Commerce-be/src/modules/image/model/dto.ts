import { z } from 'zod';
import { ImageStatus } from './image';

export const CreateImageDTOSchema = z.object({
  path: z.string().min(1, 'Image path is required'),
  cloudName: z.string().min(1, 'Cloud name is required'),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  size: z.number().int().optional(),
});
export type CreateImageDTO = z.infer<typeof CreateImageDTOSchema>;

export const UpdateImageDTOSchema = z.object({
  status: z.nativeEnum(ImageStatus).optional(),
});
export type UpdateImageDTO = z.infer<typeof UpdateImageDTOSchema>;

export type ImageCondDTO = {
  status?: string;
  cloudName?: string;
};
