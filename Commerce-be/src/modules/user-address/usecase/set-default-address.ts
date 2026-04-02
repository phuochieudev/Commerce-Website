import { ICommandHandler } from '../../../share/interface';
import { SetDefaultAddressCommand, IUserAddressRepository } from '../interface';
import { ErrAddressNotFound, ErrAddressNotBelongToUser } from '../model/errors';
import { AddressStatus } from '../model/user-address';

export class SetDefaultAddressCmdHandler implements ICommandHandler<SetDefaultAddressCommand, void> {
  constructor(private readonly repository: IUserAddressRepository) {}

  async execute(command: SetDefaultAddressCommand): Promise<void> {
    const existing = await this.repository.get(command.id);
    if (!existing || existing.status === AddressStatus.DELETED) throw ErrAddressNotFound;
    if (existing.userId !== command.userId) throw ErrAddressNotBelongToUser;

    await this.repository.clearDefault(command.userId);
    await this.repository.update(command.id, { isDefault: true });
  }
}
