import { PagingDTO } from '../../../share/model/paging';
import { ProductRating } from '../model/product-rating';
import { CreateRatingDTO, UpdateRatingDTO } from '../model/dto';

export interface IProductRatingRepository {
  findByUserAndProduct(userId: string, productId: string): Promise<ProductRating | null>;
  listByProductId(productId: string, paging: PagingDTO): Promise<ProductRating[]>;
  countByProductId(productId: string): Promise<number>;
  insert(data: ProductRating): Promise<boolean>;
  update(userId: string, productId: string, data: UpdateRatingDTO): Promise<boolean>;
  delete(userId: string, productId: string): Promise<boolean>;
}

export interface CreateRatingCommand {
  userId: string;
  productId: string;
  dto: CreateRatingDTO;
}

export interface UpdateRatingCommand {
  userId: string;
  productId: string;
  dto: UpdateRatingDTO;
}

export interface DeleteRatingCommand {
  userId: string;
  productId: string;
}

export interface ListRatingsQuery {
  productId: string;
  paging: PagingDTO;
}
