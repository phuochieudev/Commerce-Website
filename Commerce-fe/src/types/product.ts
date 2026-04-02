import { BaseEntity } from './common';

export interface Product extends BaseEntity {
  name: string;
  description?: string;
  price: number;
  cost?: number;
  discount?: number;
  image?: string;
  images?: string[];
  brandId: string;
  categoryId: string;
  quantity: number;
  rating?: number;
  reviews?: number;
  sku: string;
}

export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}
