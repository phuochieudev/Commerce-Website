import { ICommandHandler } from '../../../share/interface';
import { DeleteImageCommand, IImageRepository } from '../interface';
import { ErrImageNotFound } from '../model/errors';

export class DeleteImageCmdHandler implements ICommandHandler<DeleteImageCommand, void> {
  constructor(private readonly repository: IImageRepository) {}

  async execute(command: DeleteImageCommand): Promise<void> {
    const existing = await this.repository.get(command.id);
    if (!existing) {
      throw ErrImageNotFound;
    }
    await this.repository.delete(command.id);
  }
}
