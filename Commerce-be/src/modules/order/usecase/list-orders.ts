import { IQueryHandler } from '../../../share/interface';
import { ListOrdersQuery, IOrderRepository } from '../interface';
import { Order } from '../model/order';

export class ListOrdersQueryHandler implements IQueryHandler<ListOrdersQuery, Order[]> {
  constructor(private readonly repository: IOrderRepository) {}

  async query(query: ListOrdersQuery): Promise<Order[]> {
    const cond = query.isAdmin ? {} : { userId: query.userId };
    const total = await this.repository.count(cond);
    query.paging.total = total;
    return await this.repository.list(cond, query.paging);
  }
}
