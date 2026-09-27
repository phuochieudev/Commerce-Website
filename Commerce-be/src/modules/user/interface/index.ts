import { IRepository } from '../../../share/interface';
import { User } from '../model/user';
import { UpdateProfileDTO, UserCondDTO, ChangePasswordDTO } from '../model/dto';

export interface IUserRepository extends IRepository<User, UserCondDTO, UpdateProfileDTO> {
  updatePassword(id: string, password: string, salt: string): Promise<boolean>;
}

export interface RegisterCommand {
  dto: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
}

export interface LoginCommand {
  dto: {
    email: string;
    password: string;
  };
}

export interface GetProfileQuery {
  userId: string;
}

export interface UpdateProfileCommand {
  userId: string;
  dto: UpdateProfileDTO;
}

export interface ChangePasswordCommand {
  userId: string;
  dto: ChangePasswordDTO;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password' | 'salt'>;
}
