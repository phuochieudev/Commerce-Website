import { IRepository } from '../../../share/interface';
import { User } from '../model/user';
import { UpdateProfileDTO, UserCondDTO } from '../model/dto';

export interface IUserRepository extends IRepository<User, UserCondDTO, UpdateProfileDTO> {}

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

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password' | 'salt'>;
}
