import { BaseEntity } from './common';

export type ProductGender = 'male' | 'female' | 'unisex';

export interface Product extends BaseEntity {
  name: string;
  gender: ProductGender;
  images: string[] | null;
  price: number;
  salePrice: number | null;
  colors: string | null;
  quantity: number;
  brandId: string;
  categoryId: string;
  content?: string | null;
  description?: string | null;
  rating: number;
  saleCount: number;
}

export interface ProductVariant extends BaseEntity {
  productId: string;
  sku: string;
  color?: string | null;
  size?: string | null;
  price: number;
  salePrice?: number | null;
  quantity: number;
  image?: string | null;
}

export type ProductSort = 'newest' | 'price_asc' | 'price_desc' | 'rating_desc';

export interface ProductFilter {
  name?: string;
  gender?: ProductGender;
  brandId?: string;
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: ProductSort;
}

export interface ProductListResponse {
  data: Product[];
  paging: { page: number; limit: number; total: number };
}
