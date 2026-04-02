import { ICommandHandler } from '../../../share/interface';
import { DeleteVariantCommand, IProductVariantRepository } from '../interface';
import { ErrVariantNotFound } from '../model/errors';
import { ModelStatus } from '../../../share/model/base-model';

export class DeleteVariantCmdHandler implements ICommandHandler<DeleteVariantCommand, void> {
  constructor(private readonly repository: IProductVariantRepository) {}

  async execute(command: DeleteVariantCommand): Promise<void> {
    const existing = await this.repository.get(command.id);
    if (!existing || existing.status === ModelStatus.DELETED) throw ErrVariantNotFound;

    await this.repository.delete(command.id);
  }
}
