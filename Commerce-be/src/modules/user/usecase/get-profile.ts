import { IQueryHandler, IQueryRepository } from '../../../share/interface';
import { GetProfileQuery } from '../interface';
import { User, UserStatus } from '../model/user';
import { UserCondDTO } from '../model/dto';
import { ErrUserNotFound } from '../model/errors';

export class GetProfileQueryHandler implements IQueryHandler<GetProfileQuery, Omit<User, 'password' | 'salt'>> {
  constructor(private readonly repository: IQueryRepository<User, UserCondDTO>) {}

  async query(query: GetProfileQuery): Promise<Omit<User, 'password' | 'salt'>> {
    const user = await this.repository.get(query.userId);

    if (!user || user.status === UserStatus.DELETED) {
      throw ErrUserNotFound;
    }

    const { password, salt, ...userWithoutSensitive } = user;
    return userWithoutSensitive;
  }
}
