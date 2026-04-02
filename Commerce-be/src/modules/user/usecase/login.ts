import { ICommandHandler } from '../../../share/interface';
import { LoginCommand, IUserRepository, AuthResponse } from '../interface';
import { LoginDTOSchema } from '../model/dto';
import { UserStatus } from '../model/user';
import { ErrInvalidCredentials, ErrUserBanned, ErrUserInactive } from '../model/errors';
import { hashPassword } from '../../../share/helper/hash';
import { generateToken } from '../../../share/helper/token';

export class LoginCmdHandler implements ICommandHandler<LoginCommand, AuthResponse> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(command: LoginCommand): Promise<AuthResponse> {
    const { success, data } = LoginDTOSchema.safeParse(command.dto);

    if (!success) {
      throw new Error('Invalid data');
    }

    const user = await this.repository.findByCond({ email: data.email });
    if (!user) {
      throw ErrInvalidCredentials;
    }

    if (user.status === UserStatus.BANNED) throw ErrUserBanned;
    if (user.status === UserStatus.INACTIVE || user.status === UserStatus.DELETED) throw ErrUserInactive;

    const hashedPassword = hashPassword(data.password, user.salt || '');
    if (hashedPassword !== user.password) {
      throw ErrInvalidCredentials;
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    const { password: _, salt: __, ...userWithoutSensitive } = user;

    return { token, user: userWithoutSensitive };
  }
}
