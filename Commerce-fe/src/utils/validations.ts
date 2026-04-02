import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    fullName: z.string().min(2, 'Full name is required'),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const ProductSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  cost: z.number().optional(),
  discount: z.number().optional(),
  brandId: z.string().min(1, 'Brand is required'),
  categoryId: z.string().min(1, 'Category is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
  sku: z.string().min(1, 'SKU is required'),
});

export const BrandSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  tagLine: z.string().optional(),
});

export const CategorySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type ProductFormData = z.infer<typeof ProductSchema>;
export type BrandFormData = z.infer<typeof BrandSchema>;
export type CategoryFormData = z.infer<typeof CategorySchema>;
