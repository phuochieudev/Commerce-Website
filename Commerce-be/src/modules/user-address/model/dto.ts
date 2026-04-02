import { z } from 'zod';

export const UserAddressCreateDTOSchema = z.object({
  title: z.string().min(1).max(100),
  recipientName: z.string().min(1).max(100),
  phone: z.string().min(1).max(20),
  address: z.string().min(1).max(255),
  city: z.string().min(1).max(100),
  isDefault: z.boolean().default(false),
});
export type UserAddressCreateDTO = z.infer<typeof UserAddressCreateDTOSchema>;

export const UserAddressUpdateDTOSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  recipientName: z.string().min(1).max(100).optional(),
  phone: z.string().min(1).max(20).optional(),
  address: z.string().min(1).max(255).optional(),
  city: z.string().min(1).max(100).optional(),
  isDefault: z.boolean().optional(),
});
export type UserAddressUpdateDTO = z.infer<typeof UserAddressUpdateDTOSchema>;

export type UserAddressCondDTO = {
  userId?: string;
};
