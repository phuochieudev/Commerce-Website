import { IQueryHandler, IQueryRepository } from '../../../share/interface';
import { ListCartQuery, ICartRepository } from '../interface';
import { Cart } from '../model/cart';

export class ListCartQueryHandler implements IQueryHandler<ListCartQuery, Cart[]> {
  constructor(
    private readonly repository: ICartRepository,
    private readonly productRepository?: IQueryRepository<any, any>
  ) {}

  async query(query: ListCartQuery): Promise<Cart[]> {
    const items = await this.repository.listByUserId(query.userId, query.paging);
    if (!this.productRepository || items.length === 0) return items;

    const uniqueProductIds = Array.from(new Set(items.map((item) => item.productId)));
    const products = await Promise.all(uniqueProductIds.map((id) => this.productRepository!.get(id)));
    const productById = new Map(uniqueProductIds.map((id, index) => [id, products[index]]));

    return items.map((item) => ({ ...item, product: productById.get(item.productId) ?? null })) as any;
  }
}
