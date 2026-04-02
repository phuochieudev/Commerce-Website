import { v7 } from 'uuid';
import { ICommandHandler } from '../../../share/interface';
import { CreateCouponCommand, ICouponRepository } from '../interface';
import { CouponCreateDTOSchema } from '../model/dto';
import { ErrCouponCodeDuplicate } from '../model/errors';
import { ModelStatus } from '../../../share/model/base-model';

export class CreateCouponCmdHandler implements ICommandHandler<CreateCouponCommand, string> {
  constructor(private readonly repository: ICouponRepository) {}

  async execute(command: CreateCouponCommand): Promise<string> {
    const { success, data } = CouponCreateDTOSchema.safeParse(command.dto);
    if (!success) {
      throw new Error('Invalid data');
    }

    const existing = await this.repository.findByCode(data.code);
    if (existing) {
      throw ErrCouponCodeDuplicate;
    }

    const newId = v7();
    await this.repository.insert({
      id: newId,
      code: data.code.toUpperCase(),
      description: data.description,
      type: data.type,
      value: data.value,
      minOrderValue: data.minOrderValue,
      maxDiscount: data.maxDiscount,
      usageLimit: data.usageLimit,
      usageCount: 0,
      startDate: data.startDate,
      endDate: data.endDate,
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return newId;
  }
}
