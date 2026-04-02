import { IQueryHandler } from '../../../share/interface';
import { ListAddressesQuery, IUserAddressRepository } from '../interface';
import { UserAddress } from '../model/user-address';

export class ListAddressesQueryHandler implements IQueryHandler<ListAddressesQuery, UserAddress[]> {
  constructor(private readonly repository: IUserAddressRepository) {}

  async query(query: ListAddressesQuery): Promise<UserAddress[]> {
    return await this.repository.list({ userId: query.userId });
  }
}
