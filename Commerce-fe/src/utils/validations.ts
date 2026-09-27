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
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Converts an empty string / null / undefined into `undefined` so optional
// numeric fields left blank in a form don't get coerced to 0.
const emptyToUndefined = (val: unknown) =>
  val === '' || val === null || typeof val === 'undefined' ? undefined : val;

export const ProductSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  gender: z.enum(['male', 'female', 'unisex'], { errorMap: () => ({ message: 'Gender is required' }) }),
  price: z.coerce.number().positive('Price must be positive'),
  salePrice: z.preprocess(emptyToUndefined, z.coerce.number().nonnegative('Sale price must be 0 or more').optional()),
  colors: z.string().optional(),
  quantity: z.coerce.number().int().nonnegative('Quantity must be 0 or more'),
  brandId: z.string().min(1, 'Brand is required'),
  categoryId: z.string().min(1, 'Category is required'),
  content: z.string().optional(),
  description: z.string().optional(),
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

export const CouponSchema = z
  .object({
    code: z.string().min(2, 'Code is required'),
    description: z.string().optional(),
    type: z.enum(['percent', 'fixed'], { errorMap: () => ({ message: 'Type is required' }) }),
    value: z.coerce.number().positive('Value must be positive'),
    minOrderValue: z.preprocess(emptyToUndefined, z.coerce.number().nonnegative().optional()),
    maxDiscount: z.preprocess(emptyToUndefined, z.coerce.number().nonnegative().optional()),
    usageLimit: z.preprocess(emptyToUndefined, z.coerce.number().int().positive().optional()),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type ProductFormData = z.infer<typeof ProductSchema>;
export type BrandFormData = z.infer<typeof BrandSchema>;
export type CategoryFormData = z.infer<typeof CategorySchema>;
export type CouponFormData = z.infer<typeof CouponSchema>;
