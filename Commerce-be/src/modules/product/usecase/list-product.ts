import { IQueryHandler, IQueryRepository } from '../../../share/interface';
import { ListProductQuery } from '../interface';
import { Product } from '../model/product';
import { ProductCondDTO } from '../model/dto';

export class ListProductQueryHandler implements IQueryHandler<ListProductQuery, Product[]> {
  constructor(private readonly repository: IQueryRepository<Product, ProductCondDTO>) {}

  async query(query: ListProductQuery): Promise<Product[]> {
    return await this.repository.list(query.cond, query.paging);
  }
}
