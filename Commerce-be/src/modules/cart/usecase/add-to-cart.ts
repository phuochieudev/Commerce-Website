import { v7 } from 'uuid';
import { ICommandHandler } from '../../../share/interface';
import { AddToCartCommand, ICartRepository } from '../interface';
import { AddToCartDTOSchema } from '../model/dto';

export class AddToCartCmdHandler implements ICommandHandler<AddToCartCommand, string> {
  constructor(private readonly repository: ICartRepository) {}

  async execute(command: AddToCartCommand): Promise<string> {
    const { success, data } = AddToCartDTOSchema.safeParse(command.dto);
    if (!success) {
      throw new Error('Invalid data');
    }

    const existing = await this.repository.findByUserProductAttribute(
      command.userId,
      data.productId,
      data.attribute
    );

    if (existing) {
      await this.repository.update(existing.id, {
        quantity: existing.quantity + data.quantity,
      });
      return existing.id;
    }

    const newId = v7();
    await this.repository.insert({
      id: newId,
      userId: command.userId,
      productId: data.productId,
      attribute: data.attribute,
      quantity: data.quantity,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return newId;
  }
}
