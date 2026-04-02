import { IQueryHandler } from '../../../share/interface';
import { ListRatingsQuery, IProductRatingRepository } from '../interface';
import { ProductRating } from '../model/product-rating';

export class ListRatingsQueryHandler implements IQueryHandler<ListRatingsQuery, ProductRating[]> {
  constructor(private readonly repository: IProductRatingRepository) {}

  async query(query: ListRatingsQuery): Promise<ProductRating[]> {
    const total = await this.repository.countByProductId(query.productId);
    query.paging.total = total;
    return await this.repository.listByProductId(query.productId, query.paging);
  }
}
