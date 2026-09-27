import { ICommandHandler } from '../../../share/interface';
import { ChangePasswordCommand, IUserRepository } from '../interface';
import { ChangePasswordDTOSchema } from '../model/dto';
import { ErrUserNotFound, ErrOldPasswordIncorrect } from '../model/errors';
import { generateSalt, hashPassword } from '../../../share/helper/hash';

export class ChangePasswordCmdHandler implements ICommandHandler<ChangePasswordCommand, void> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(command: ChangePasswordCommand): Promise<void> {
    const { success, data } = ChangePasswordDTOSchema.safeParse(command.dto);

    if (!success) {
      throw new Error('Invalid data');
    }

    const user = await this.repository.get(command.userId);
    if (!user) {
      throw ErrUserNotFound;
    }

    const oldHashed = hashPassword(data.oldPassword, user.salt || '');
    if (oldHashed !== user.password) {
      throw ErrOldPasswordIncorrect;
    }

    const newSalt = generateSalt();
    const newHashed = hashPassword(data.newPassword, newSalt);
    await this.repository.updatePassword(command.userId, newHashed, newSalt);
  }
}
