import { BaseEntity } from './common';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  attribute: string;
  image?: string | null;
  name?: string | null;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
export type ShippingMethod = 'free' | 'standard';
export type PaymentMethod = 'cod' | 'zalo';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Order extends Omit<BaseEntity, 'status'> {
  status: OrderStatus;
  userId: string;
  shippingAddress: string;
  shippingCity: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  recipientFirstName: string;
  recipientLastName: string;
  recipientPhone: string;
  recipientEmail?: string | null;
  trackingNumber?: string | null;
  couponId?: string | null;
  discountAmount: number;
  totalAmount: number;
  items?: OrderItem[];
}

export interface CreateOrderItemInput {
  productId: string;
  attribute: string;
  quantity: number;
}

export interface CreateOrderInput {
  shippingAddress: string;
  shippingCity: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  recipientFirstName: string;
  recipientLastName: string;
  recipientPhone: string;
  recipientEmail?: string;
  couponCode?: string;
  items: CreateOrderItemInput[];
}

export interface OrderListResponse {
  data: Order[];
  paging: { page: number; limit: number; total: number };
}
