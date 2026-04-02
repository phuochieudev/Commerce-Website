import { ICommandHandler } from '../../../share/interface';
import { DeleteProductCommand, IProductRepository } from '../interface';
import { ModelStatus } from '../../../share/model/base-model';
import { ErrProductNotFound } from '../model/errors';

export class DeleteProductCmdHandler implements ICommandHandler<DeleteProductCommand, void> {
  constructor(private readonly repository: IProductRepository) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const existing = await this.repository.get(command.id);

    if (!existing || existing.status === ModelStatus.DELETED) {
      throw ErrProductNotFound;
    }

    await this.repository.delete(command.id, command.isHardDelete);
  }
}
