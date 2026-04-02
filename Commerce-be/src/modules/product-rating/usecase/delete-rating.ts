import { ICommandHandler } from '../../../share/interface';
import { DeleteRatingCommand, IProductRatingRepository } from '../interface';
import { ErrRatingNotFound } from '../model/errors';

export class DeleteRatingCmdHandler implements ICommandHandler<DeleteRatingCommand, void> {
  constructor(private readonly repository: IProductRatingRepository) {}

  async execute(command: DeleteRatingCommand): Promise<void> {
    const existing = await this.repository.findByUserAndProduct(command.userId, command.productId);
    if (!existing) {
      throw ErrRatingNotFound;
    }

    await this.repository.delete(command.userId, command.productId);
  }
}
