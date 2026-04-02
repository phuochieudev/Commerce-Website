import { IQueryHandler } from '../../../share/interface';
import { GetOrderDetailQuery, IOrderRepository } from '../interface';
import { Order } from '../model/order';
import { ErrOrderNotFound } from '../model/errors';

export class GetOrderDetailQueryHandler implements IQueryHandler<GetOrderDetailQuery, Order> {
  constructor(private readonly repository: IOrderRepository) {}

  async query(query: GetOrderDetailQuery): Promise<Order> {
    const order = await this.repository.getById(query.orderId);

    if (!order) {
      throw ErrOrderNotFound;
    }

    if (!query.isAdmin && order.userId !== query.userId) {
      throw ErrOrderNotFound;
    }

    return order;
  }
}
