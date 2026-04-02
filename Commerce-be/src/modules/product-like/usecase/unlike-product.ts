import { ICommandHandler } from '../../../share/interface';
import { UnlikeProductCommand, IProductLikeRepository } from '../interface';
import { ErrNotLiked } from '../model/errors';

export class UnlikeProductCmdHandler implements ICommandHandler<UnlikeProductCommand, void> {
  constructor(private readonly repository: IProductLikeRepository) {}

  async execute(command: UnlikeProductCommand): Promise<void> {
    const existing = await this.repository.findByUserAndProduct(command.userId, command.productId);
    if (!existing) {
      throw ErrNotLiked;
    }

    await this.repository.delete(command.userId, command.productId);
  }
}
