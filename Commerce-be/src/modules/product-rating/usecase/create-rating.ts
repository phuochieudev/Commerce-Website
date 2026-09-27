import { ICommandHandler } from '../../../share/interface';
import { CreateRatingCommand, IProductRatingRepository } from '../interface';
import { CreateRatingDTOSchema } from '../model/dto';
import { ErrAlreadyRated } from '../model/errors';

export class CreateRatingCmdHandler implements ICommandHandler<CreateRatingCommand, void> {
  constructor(private readonly repository: IProductRatingRepository) {}

  async execute(command: CreateRatingCommand): Promise<void> {
    const { success, data } = CreateRatingDTOSchema.safeParse(command.dto);
    if (!success) {
      throw new Error('Invalid data');
    }

    const existing = await this.repository.findByUserAndProduct(command.userId, command.productId);
    if (existing) {
      throw ErrAlreadyRated;
    }

    await this.repository.insert({
      userId: command.userId,
      productId: command.productId,
      rating: data.rating,
      content: data.content,
      createdAt: new Date(),
    });
  }
}
