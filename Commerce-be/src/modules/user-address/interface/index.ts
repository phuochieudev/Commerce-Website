import { UserAddress } from '../model/user-address';
import { UserAddressCondDTO, UserAddressCreateDTO, UserAddressUpdateDTO } from '../model/dto';

export interface IUserAddressRepository {
  get(id: string): Promise<UserAddress | null>;
  list(cond: UserAddressCondDTO): Promise<UserAddress[]>;
  insert(data: UserAddress): Promise<boolean>;
  update(id: string, data: UserAddressUpdateDTO): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  clearDefault(userId: string): Promise<boolean>;
}

export interface CreateAddressCommand {
  userId: string;
  dto: UserAddressCreateDTO;
}

export interface UpdateAddressCommand {
  id: string;
  userId: string;
  dto: UserAddressUpdateDTO;
}

export interface DeleteAddressCommand {
  id: string;
  userId: string;
}

export interface SetDefaultAddressCommand {
  id: string;
  userId: string;
}

export interface ListAddressesQuery {
  userId: string;
}
