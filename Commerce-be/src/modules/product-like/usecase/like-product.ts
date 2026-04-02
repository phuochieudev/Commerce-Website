import { ICommandHandler } from '../../../share/interface';
import { LikeProductCommand, IProductLikeRepository } from '../interface';
import { ErrAlreadyLiked } from '../model/errors';

export class LikeProductCmdHandler implements ICommandHandler<LikeProductCommand, void> {
  constructor(private readonly repository: IProductLikeRepository) {}

  async execute(command: LikeProductCommand): Promise<void> {
    const existing = await this.repository.findByUserAndProduct(command.userId, command.productId);
    if (existing) {
      throw ErrAlreadyLiked;
    }

    await this.repository.insert({
      userId: command.userId,
      productId: command.productId,
      createdAt: new Date(),
    });
  }
}
