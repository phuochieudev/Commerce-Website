import { z } from 'zod';

export const modelName = 'Order';

export enum ShippingMethod {
  FREE = 'free',
  STANDARD = 'standard',
}

export enum PaymentMethod {
  COD = 'cod',
  ZALO = 'zalo',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export const OrderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  shippingAddress: z.string().nullable().optional(),
  shippingCity: z.string().nullable().optional(),
  shippingMethod: z.nativeEnum(ShippingMethod),
  paymentMethod: z.nativeEnum(PaymentMethod),
  paymentStatus: z.nativeEnum(PaymentStatus),
  recipientFirstName: z.string().nullable().optional(),
  recipientLastName: z.string().nullable().optional(),
  recipientPhone: z.string().nullable().optional(),
  recipientEmail: z.string().nullable().optional(),
  trackingNumber: z.string().nullable().optional(),
  couponId: z.string().uuid().nullable().optional(),
  discountAmount: z.number().min(0).default(0),
  totalAmount: z.number().min(0).default(0),
  status: z.nativeEnum(OrderStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Order = z.infer<typeof OrderSchema> & { items?: OrderItem[] };

export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  productId: z.string().uuid(),
  attribute: z.string(),
  image: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  quantity: z.number().int().min(1),
  price: z.number().min(0),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;
