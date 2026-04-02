import { v7 } from 'uuid';
import { ICommandHandler } from '../../../share/interface';
import { CreateAddressCommand, IUserAddressRepository } from '../interface';
import { UserAddressCreateDTOSchema } from '../model/dto';
import { AddressStatus } from '../model/user-address';

export class CreateAddressCmdHandler implements ICommandHandler<CreateAddressCommand, string> {
  constructor(private readonly repository: IUserAddressRepository) {}

  async execute(command: CreateAddressCommand): Promise<string> {
    const { success, data } = UserAddressCreateDTOSchema.safeParse(command.dto);
    if (!success) throw new Error('Invalid data');

    const newId = v7();

    if (data.isDefault) {
      await this.repository.clearDefault(command.userId);
    }

    await this.repository.insert({
      id: newId,
      userId: command.userId,
      title: data.title,
      recipientName: data.recipientName,
      phone: data.phone,
      address: data.address,
      city: data.city,
      isDefault: data.isDefault,
      status: AddressStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return newId;
  }
}
