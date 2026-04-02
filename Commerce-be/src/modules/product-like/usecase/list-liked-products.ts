import { IQueryHandler } from '../../../share/interface';
import { ListLikedProductsQuery, IProductLikeRepository } from '../interface';
import { ProductLike } from '../model/product-like';

export class ListLikedProductsQueryHandler implements IQueryHandler<ListLikedProductsQuery, ProductLike[]> {
  constructor(private readonly repository: IProductLikeRepository) {}

  async query(query: ListLikedProductsQuery): Promise<ProductLike[]> {
    const total = await this.repository.countByUserId(query.userId);
    query.paging.total = total;
    return await this.repository.listByUserId(query.userId, query.paging);
  }
}
