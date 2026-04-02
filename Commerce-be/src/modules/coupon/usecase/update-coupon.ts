import { ICommandHandler } from '../../../share/interface';
import { UpdateCouponCommand, ICouponRepository } from '../interface';
import { CouponUpdateDTOSchema } from '../model/dto';
import { ErrCouponNotFound } from '../model/errors';
import { ModelStatus } from '../../../share/model/base-model';

export class UpdateCouponCmdHandler implements ICommandHandler<UpdateCouponCommand, void> {
  constructor(private readonly repository: ICouponRepository) {}

  async execute(command: UpdateCouponCommand): Promise<void> {
    const { success, data } = CouponUpdateDTOSchema.safeParse(command.dto);
    if (!success) {
      throw new Error('Invalid data');
    }

    const existing = await this.repository.get(command.id);
    if (!existing || existing.status === ModelStatus.DELETED) {
      throw ErrCouponNotFound;
    }

    await this.repository.update(command.id, data);
  }
}
