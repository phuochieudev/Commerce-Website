import { BaseEntity } from './common';

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  discount?: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';

export interface Order extends Omit<BaseEntity, 'status'> {
  status: OrderStatus;
  userId: string;
  items: OrderItem[];
  total: number;
  discount?: number;
  shippingAddress: string;
  paymentMethod: string;
  note?: string;
}
