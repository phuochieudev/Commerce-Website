import { ICommandHandler } from '../../../share/interface';
import { DeleteCouponCommand, ICouponRepository } from '../interface';
import { ErrCouponNotFound } from '../model/errors';
import { ModelStatus } from '../../../share/model/base-model';

export class DeleteCouponCmdHandler implements ICommandHandler<DeleteCouponCommand, void> {
  constructor(private readonly repository: ICouponRepository) {}

  async execute(command: DeleteCouponCommand): Promise<void> {
    const existing = await this.repository.get(command.id);
    if (!existing || existing.status === ModelStatus.DELETED) {
      throw ErrCouponNotFound;
    }

    await this.repository.delete(command.id);
  }
}
