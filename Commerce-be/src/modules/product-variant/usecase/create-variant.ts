import { v7 } from 'uuid';
import { ICommandHandler } from '../../../share/interface';
import { CreateVariantCommand, IProductVariantRepository } from '../interface';
import { ProductVariantCreateDTOSchema } from '../model/dto';
import { ErrVariantSkuDuplicate } from '../model/errors';
import { ModelStatus } from '../../../share/model/base-model';

export class CreateVariantCmdHandler implements ICommandHandler<CreateVariantCommand, string> {
  constructor(private readonly repository: IProductVariantRepository) {}

  async execute(command: CreateVariantCommand): Promise<string> {
    const { success, data } = ProductVariantCreateDTOSchema.safeParse(command.dto);
    if (!success) throw new Error('Invalid data');

    const existing = await this.repository.findBySku(data.sku);
    if (existing) throw ErrVariantSkuDuplicate;

    const newId = v7();
    await this.repository.insert({
      id: newId,
      productId: command.productId,
      sku: data.sku,
      color: data.color,
      size: data.size,
      price: data.price,
      salePrice: data.salePrice,
      quantity: data.quantity,
      image: data.image,
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return newId;
  }
}
