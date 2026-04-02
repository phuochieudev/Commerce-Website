import { v7 } from 'uuid';
import { ICommandHandler } from '../../../share/interface';
import { CreateProductCommand, IProductRepository } from '../interface';
import { ProductCreateDTOSchema } from '../model/dto';
import { ModelStatus } from '../../../share/model/base-model';

export class CreateProductCmdHandler implements ICommandHandler<CreateProductCommand, string> {
  constructor(private readonly repository: IProductRepository) {}

  async execute(command: CreateProductCommand): Promise<string> {
    const { success, data, error } = ProductCreateDTOSchema.safeParse(command.dto);

    if (!success) {
      throw new Error('Invalid data');
    }

    const newId = v7();
    const product = {
      ...data,
      id: newId,
      rating: 0,
      saleCount: 0,
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.repository.insert(product);
    return newId;
  }
}
