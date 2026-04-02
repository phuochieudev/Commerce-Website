import { ICommandHandler } from '../../../share/interface';
import { DeleteAddressCommand, IUserAddressRepository } from '../interface';
import { ErrAddressNotFound, ErrAddressNotBelongToUser } from '../model/errors';
import { AddressStatus } from '../model/user-address';

export class DeleteAddressCmdHandler implements ICommandHandler<DeleteAddressCommand, void> {
  constructor(private readonly repository: IUserAddressRepository) {}

  async execute(command: DeleteAddressCommand): Promise<void> {
    const existing = await this.repository.get(command.id);
    if (!existing || existing.status === AddressStatus.DELETED) throw ErrAddressNotFound;
    if (existing.userId !== command.userId) throw ErrAddressNotBelongToUser;

    await this.repository.delete(command.id);
  }
}
