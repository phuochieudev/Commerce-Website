import { z } from 'zod';

export const modelName = 'UserAddress';

export enum AddressStatus {
  ACTIVE = 'active',
  DELETED = 'deleted',
}

export const UserAddressSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string(),
  recipientName: z.string(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  isDefault: z.boolean().default(false),
  status: z.nativeEnum(AddressStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserAddress = z.infer<typeof UserAddressSchema>;
