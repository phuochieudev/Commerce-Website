import { IQueryHandler } from '../../../share/interface';
import { ListCartQuery, ICartRepository } from '../interface';
import { Cart } from '../model/cart';

export class ListCartQueryHandler implements IQueryHandler<ListCartQuery, Cart[]> {
  constructor(private readonly repository: ICartRepository) {}

  async query(query: ListCartQuery): Promise<Cart[]> {
    return await this.repository.listByUserId(query.userId, query.paging);
  }
}
