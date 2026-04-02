import { z } from 'zod';

export const modelName = 'Image';

export enum ImageStatus {
  UPLOADED = 'uploaded',
  USED = 'used',
}

export const ImageSchema = z.object({
  id: z.string().uuid(),
  path: z.string(),
  cloudName: z.string(),
  width: z.number().int().nullable().optional(),
  height: z.number().int().nullable().optional(),
  size: z.number().int().nullable().optional(),
  status: z.nativeEnum(ImageStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Image = z.infer<typeof ImageSchema>;
