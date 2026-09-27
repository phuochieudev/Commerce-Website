import { Product } from './product';

// The backend has no "Cart" aggregate — each row IS one cart line item.
export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  attribute: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product?: Product | null;
}
