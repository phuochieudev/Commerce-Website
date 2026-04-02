import { v7 } from 'uuid';
import { ICommandHandler } from '../../../share/interface';
import { CreateImageCommand, IImageRepository } from '../interface';
import { CreateImageDTOSchema } from '../model/dto';
import { ImageStatus } from '../model/image';

export class CreateImageCmdHandler implements ICommandHandler<CreateImageCommand, string> {
  constructor(private readonly repository: IImageRepository) {}

  async execute(command: CreateImageCommand): Promise<string> {
    const { success, data } = CreateImageDTOSchema.safeParse(command.dto);
    if (!success) {
      throw new Error('Invalid data');
    }

    const newId = v7();
    await this.repository.insert({
      id: newId,
      path: data.path,
      cloudName: data.cloudName,
      width: data.width,
      height: data.height,
      size: data.size,
      status: ImageStatus.UPLOADED,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return newId;
  }
}
