import { z } from 'zod';
import { ShippingMethod, PaymentMethod, OrderStatus, PaymentStatus } from './order';

export const OrderItemInputSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  attribute: z.string().min(1, 'Attribute is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const CreateOrderDTOSchema = z.object({
  shippingAddress: z.string().min(1, 'Shipping address is required'),
  shippingCity: z.string().min(1, 'Shipping city is required'),
  shippingMethod: z.nativeEnum(ShippingMethod),
  paymentMethod: z.nativeEnum(PaymentMethod),
  recipientFirstName: z.string().min(1, 'Recipient first name is required'),
  recipientLastName: z.string().min(1, 'Recipient last name is required'),
  recipientPhone: z.string().min(1, 'Recipient phone is required'),
  recipientEmail: z.string().email('Invalid email').optional(),
  couponCode: z.string().optional(),
  items: z.array(OrderItemInputSchema).min(1, 'At least one item is required'),
});
export type CreateOrderDTO = z.infer<typeof CreateOrderDTOSchema>;

export const UpdateOrderStatusDTOSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  trackingNumber: z.string().optional(),
});
export type UpdateOrderStatusDTO = z.infer<typeof UpdateOrderStatusDTOSchema>;

export type OrderCondDTO = {
  userId?: string;
  status?: string;
  paymentStatus?: string;
};
