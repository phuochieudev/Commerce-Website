import { ICommandHandler } from '../../../share/interface';
import { UpdateCartCommand, ICartRepository } from '../interface';
import { UpdateCartDTOSchema } from '../model/dto';
import { ErrCartItemNotFound, ErrCartItemNotOwned } from '../model/errors';

export class UpdateCartCmdHandler implements ICommandHandler<UpdateCartCommand, void> {
  constructor(private readonly repository: ICartRepository) {}

  async execute(command: UpdateCartCommand): Promise<void> {
    const { success, data } = UpdateCartDTOSchema.safeParse(command.dto);
    if (!success) {
      throw new Error('Invalid data');
    }

    const item = await this.repository.findById(command.cartItemId);
    if (!item) throw ErrCartItemNotFound;
    if (item.userId !== command.userId) throw ErrCartItemNotOwned;

    await this.repository.update(command.cartItemId, data);
  }
}
