import { ICommandHandler } from '../../../share/interface';
import { UpdateAddressCommand, IUserAddressRepository } from '../interface';
import { UserAddressUpdateDTOSchema } from '../model/dto';
import { ErrAddressNotFound, ErrAddressNotBelongToUser } from '../model/errors';
import { AddressStatus } from '../model/user-address';

export class UpdateAddressCmdHandler implements ICommandHandler<UpdateAddressCommand, void> {
  constructor(private readonly repository: IUserAddressRepository) {}

  async execute(command: UpdateAddressCommand): Promise<void> {
    const { success, data } = UserAddressUpdateDTOSchema.safeParse(command.dto);
    if (!success) throw new Error('Invalid data');

    const existing = await this.repository.get(command.id);
    if (!existing || existing.status === AddressStatus.DELETED) throw ErrAddressNotFound;
    if (existing.userId !== command.userId) throw ErrAddressNotBelongToUser;

    if (data.isDefault) {
      await this.repository.clearDefault(command.userId);
    }

    await this.repository.update(command.id, data);
  }
}
