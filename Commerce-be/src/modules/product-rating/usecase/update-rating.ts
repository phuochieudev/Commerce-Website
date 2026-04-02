import { ICommandHandler } from '../../../share/interface';
import { UpdateRatingCommand, IProductRatingRepository } from '../interface';
import { UpdateRatingDTOSchema } from '../model/dto';
import { ErrRatingNotFound } from '../model/errors';

export class UpdateRatingCmdHandler implements ICommandHandler<UpdateRatingCommand, void> {
  constructor(private readonly repository: IProductRatingRepository) {}

  async execute(command: UpdateRatingCommand): Promise<void> {
    const { success, data } = UpdateRatingDTOSchema.safeParse(command.dto);
    if (!success) {
      throw new Error('Invalid data');
    }

    const existing = await this.repository.findByUserAndProduct(command.userId, command.productId);
    if (!existing) {
      throw ErrRatingNotFound;
    }

    await this.repository.update(command.userId, command.productId, data);
  }
}
