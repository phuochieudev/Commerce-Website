import { ICommandHandler } from '../../../share/interface';
import { UpdateProfileCommand, IUserRepository } from '../interface';
import { UpdateProfileDTOSchema } from '../model/dto';
import { UserStatus } from '../model/user';
import { ErrUserNotFound } from '../model/errors';

export class UpdateProfileCmdHandler implements ICommandHandler<UpdateProfileCommand, void> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(command: UpdateProfileCommand): Promise<void> {
    const { success, data } = UpdateProfileDTOSchema.safeParse(command.dto);

    if (!success) {
      throw new Error('Invalid data');
    }

    const user = await this.repository.get(command.userId);
    if (!user || user.status === UserStatus.DELETED) {
      throw ErrUserNotFound;
    }

    await this.repository.update(command.userId, data);
  }
}
