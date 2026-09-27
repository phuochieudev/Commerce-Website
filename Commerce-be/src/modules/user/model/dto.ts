import { z } from 'zod';
import { UserGender } from './user';

export const RegisterDTOSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type RegisterDTO = z.infer<typeof RegisterDTOSchema>;

export const LoginDTOSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginDTO = z.infer<typeof LoginDTOSchema>;

export const UpdateProfileDTOSchema = z.object({
  avatar: z.string().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  birthday: z.coerce.date().optional(),
  gender: z.nativeEnum(UserGender).optional(),
});
export type UpdateProfileDTO = z.infer<typeof UpdateProfileDTOSchema>;

export const ChangePasswordDTOSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});
export type ChangePasswordDTO = z.infer<typeof ChangePasswordDTOSchema>;

export type UserCondDTO = {
  email?: string;
  status?: string;
  role?: string;
};
