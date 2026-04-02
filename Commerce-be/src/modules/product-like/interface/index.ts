import { PagingDTO } from '../../../share/model/paging';
import { ProductLike } from '../model/product-like';

export interface IProductLikeRepository {
  findByUserAndProduct(userId: string, productId: string): Promise<ProductLike | null>;
  listByUserId(userId: string, paging: PagingDTO): Promise<ProductLike[]>;
  countByUserId(userId: string): Promise<number>;
  countByProductId(productId: string): Promise<number>;
  insert(data: ProductLike): Promise<boolean>;
  delete(userId: string, productId: string): Promise<boolean>;
}

export interface LikeProductCommand {
  userId: string;
  productId: string;
}

export interface UnlikeProductCommand {
  userId: string;
  productId: string;
}

export interface ListLikedProductsQuery {
  userId: string;
  paging: PagingDTO;
}
