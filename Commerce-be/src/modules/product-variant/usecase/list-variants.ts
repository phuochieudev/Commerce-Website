import { IQueryHandler } from '../../../share/interface';
import { ListVariantsQuery, IProductVariantRepository } from '../interface';
import { ProductVariant } from '../model/product-variant';

export class ListVariantsQueryHandler implements IQueryHandler<ListVariantsQuery, ProductVariant[]> {
  constructor(private readonly repository: IProductVariantRepository) {}

  async query(query: ListVariantsQuery): Promise<ProductVariant[]> {
    const total = await this.repository.count(query.cond);
    query.paging.total = total;
    return await this.repository.list(query.cond, query.paging);
  }
}
