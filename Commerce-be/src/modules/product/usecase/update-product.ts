import { ICommandHandler } from '../../../share/interface';
import { UpdateProductCommand, IProductRepository } from '../interface';
import { ProductUpdateDTOSchema } from '../model/dto';
import { ModelStatus } from '../../../share/model/base-model';
import { ErrProductNotFound } from '../model/errors';

export class UpdateProductCmdHandler implements ICommandHandler<UpdateProductCommand, void> {
  constructor(private readonly repository: IProductRepository) {}

  async execute(command: UpdateProductCommand): Promise<void> {
    const { success, data } = ProductUpdateDTOSchema.safeParse(command.dto);

    if (!success) {
      throw new Error('Invalid data');
    }

    const existing = await this.repository.get(command.id);
    if (!existing || existing.status === ModelStatus.DELETED) {
      throw ErrProductNotFound;
    }

    await this.repository.update(command.id, data);
  }
}
