import { IQueryHandler } from '../../../share/interface';
import { IProductLikeRepository } from '../interface';

export interface GetLikeStatusQuery {
  userId: string;
  productId: string;
}

export interface LikeStatus {
  liked: boolean;
  count: number;
}

export class GetLikeStatusQueryHandler implements IQueryHandler<GetLikeStatusQuery, LikeStatus> {
  constructor(private readonly repository: IProductLikeRepository) {}

  async query(query: GetLikeStatusQuery): Promise<LikeStatus> {
    const [existing, count] = await Promise.all([
      this.repository.findByUserAndProduct(query.userId, query.productId),
      this.repository.countByProductId(query.productId),
    ]);

    return { liked: !!existing, count };
  }
}
