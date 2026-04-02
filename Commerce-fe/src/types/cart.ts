import { BaseEntity } from './common';

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  discount?: number;
  product?: any;
}

export interface Cart extends BaseEntity {
  userId: string;
  items: CartItem[];
  total: number;
  discount?: number;
}
