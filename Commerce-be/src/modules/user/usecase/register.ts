import { v7 } from 'uuid';
import { ICommandHandler } from '../../../share/interface';
import { RegisterCommand, IUserRepository, AuthResponse } from '../interface';
import { RegisterDTOSchema } from '../model/dto';
import { User, UserGender, UserRole, UserStatus } from '../model/user';
import { ErrEmailAlreadyExists } from '../model/errors';
import { generateSalt, hashPassword } from '../../../share/helper/hash';
import { generateToken } from '../../../share/helper/token';

export class RegisterCmdHandler implements ICommandHandler<RegisterCommand, AuthResponse> {
  constructor(private readonly repository: IUserRepository) {}

  async execute(command: RegisterCommand): Promise<AuthResponse> {
    const { success, data, error } = RegisterDTOSchema.safeParse(command.dto);

    if (!success) {
      throw new Error('Invalid data');
    }

    const existing = await this.repository.findByCond({ email: data.email });
    if (existing) {
      throw ErrEmailAlreadyExists;
    }

    const salt = generateSalt();
    const hashedPassword = hashPassword(data.password, salt);
    const newId = v7();

    const user: User = {
      id: newId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      salt,
      gender: UserGender.UNKNOWN,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.repository.insert(user);

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    const { password: _, salt: __, ...userWithoutSensitive } = user;

    return { token, user: userWithoutSensitive };
  }
}
