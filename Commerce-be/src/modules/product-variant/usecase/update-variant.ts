import { ICommandHandler } from '../../../share/interface';
import { UpdateVariantCommand, IProductVariantRepository } from '../interface';
import { ProductVariantUpdateDTOSchema } from '../model/dto';
import { ErrVariantNotFound } from '../model/errors';
import { ModelStatus } from '../../../share/model/base-model';

export class UpdateVariantCmdHandler implements ICommandHandler<UpdateVariantCommand, void> {
  constructor(private readonly repository: IProductVariantRepository) {}

  async execute(command: UpdateVariantCommand): Promise<void> {
    const { success, data } = ProductVariantUpdateDTOSchema.safeParse(command.dto);
    if (!success) throw new Error('Invalid data');

    const existing = await this.repository.get(command.id);
    if (!existing || existing.status === ModelStatus.DELETED) throw ErrVariantNotFound;

    await this.repository.update(command.id, data);
  }
}
