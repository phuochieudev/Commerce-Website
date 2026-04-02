import { IQueryHandler } from '../../../share/interface';
import { GetVariantDetailQuery, IProductVariantRepository } from '../interface';
import { ProductVariant } from '../model/product-variant';
import { ErrVariantNotFound } from '../model/errors';
import { ModelStatus } from '../../../share/model/base-model';

export class GetVariantDetailQueryHandler implements IQueryHandler<GetVariantDetailQuery, ProductVariant> {
  constructor(private readonly repository: IProductVariantRepository) {}

  async query(query: GetVariantDetailQuery): Promise<ProductVariant> {
    const data = await this.repository.get(query.id);
    if (!data || data.status === ModelStatus.DELETED) throw ErrVariantNotFound;
    return data;
  }
}
