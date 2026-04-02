import { ICommandHandler } from '../../../share/interface';
import { UpdateOrderStatusCommand, IOrderRepository } from '../interface';
import { UpdateOrderStatusDTOSchema } from '../model/dto';
import { ErrOrderNotFound } from '../model/errors';

export class UpdateOrderStatusCmdHandler implements ICommandHandler<UpdateOrderStatusCommand, void> {
  constructor(private readonly repository: IOrderRepository) {}

  async execute(command: UpdateOrderStatusCommand): Promise<void> {
    const { success, data } = UpdateOrderStatusDTOSchema.safeParse(command.dto);
    if (!success) {
      throw new Error('Invalid data');
    }

    const order = await this.repository.getById(command.orderId);
    if (!order) {
      throw ErrOrderNotFound;
    }

    await this.repository.updateStatus(command.orderId, data);
  }
}
