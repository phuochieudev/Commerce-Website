import { ICommandHandler } from '../../../share/interface';
import { CancelOrderCommand, IOrderRepository } from '../interface';
import { OrderStatus } from '../model/order';
import { ErrOrderNotFound, ErrOrderCannotCancel } from '../model/errors';

export class CancelOrderCmdHandler implements ICommandHandler<CancelOrderCommand, void> {
  constructor(private readonly repository: IOrderRepository) {}

  async execute(command: CancelOrderCommand): Promise<void> {
    const order = await this.repository.getById(command.orderId);

    if (!order) {
      throw ErrOrderNotFound;
    }

    if (order.userId !== command.userId) {
      throw ErrOrderNotFound;
    }

    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.CONFIRMED) {
      throw ErrOrderCannotCancel;
    }

    await this.repository.updateStatus(command.orderId, { status: OrderStatus.CANCELLED });
  }
}
