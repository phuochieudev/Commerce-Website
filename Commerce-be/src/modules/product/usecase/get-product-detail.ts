import { IQueryHandler, IQueryRepository } from '../../../share/interface';
import { GetProductDetailQuery } from '../interface';
import { Product } from '../model/product';
import { ProductCondDTO } from '../model/dto';
import { ErrProductNotFound } from '../model/errors';
import { ModelStatus } from '../../../share/model/base-model';

export class GetProductDetailQueryHandler implements IQueryHandler<GetProductDetailQuery, Product> {
  constructor(private readonly repository: IQueryRepository<Product, ProductCondDTO>) {}

  async query(query: GetProductDetailQuery): Promise<Product> {
    const data = await this.repository.get(query.id);

    if (!data || data.status === ModelStatus.DELETED) {
      throw ErrProductNotFound;
    }

    return data;
  }
}
