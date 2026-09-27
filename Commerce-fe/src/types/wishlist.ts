import { Product } from './product';

export interface WishlistItem {
  userId: string;
  productId: string;
  createdAt?: string | null;
  product?: Product;
}

export interface LikeStatus {
  liked: boolean;
  count: number;
}
