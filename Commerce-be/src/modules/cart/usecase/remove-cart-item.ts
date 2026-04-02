import { ICommandHandler } from '../../../share/interface';
import { RemoveCartItemCommand, ICartRepository } from '../interface';
import { ErrCartItemNotFound, ErrCartItemNotOwned } from '../model/errors';

export class RemoveCartItemCmdHandler implements ICommandHandler<RemoveCartItemCommand, void> {
  constructor(private readonly repository: ICartRepository) {}

  async execute(command: RemoveCartItemCommand): Promise<void> {
    const item = await this.repository.findById(command.cartItemId);
    if (!item) throw ErrCartItemNotFound;
    if (item.userId !== command.userId) throw ErrCartItemNotOwned;

    await this.repository.delete(command.cartItemId);
  }
}
