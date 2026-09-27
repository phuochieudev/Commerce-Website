import { Sequelize } from 'sequelize';
import {
  BaseRepositorySequelize,
  BaseQueryRepositorySequelize,
  BaseCommandRepositorySequelize,
} from '../../../../../share/repository/repo-sequelize';
import { User } from '../../../model/user';
import { UpdateProfileDTO, UserCondDTO } from '../../../model/dto';

export class MYSQLUserRepository extends BaseRepositorySequelize<User, UserCondDTO, UpdateProfileDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(
      new MYSQLUserQueryRepository(sequelize, modelName),
      new MYSQLUserCommandRepository(sequelize, modelName)
    );
  }

  async updatePassword(id: string, password: string, salt: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].update({ password, salt }, { where: { id } });
    return true;
  }
}

export class MYSQLUserQueryRepository extends BaseQueryRepositorySequelize<User, UserCondDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName);
  }

  async get(id: string): Promise<User | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id);
    if (!data) return null;
    const raw = data.get({ plain: true });
    return {
      ...raw,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    } as User;
  }

  async findByCond(cond: UserCondDTO): Promise<User | null> {
    const data = await this.sequelize.models[this.modelName].findOne({ where: cond as any });
    if (!data) return null;
    const raw = data.get({ plain: true });
    return {
      ...raw,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    } as User;
  }
}

export class MYSQLUserCommandRepository extends BaseCommandRepositorySequelize<User, UpdateProfileDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName);
  }

  get(id: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  findByCond(cond: UserCondDTO): Promise<User | null> {
    throw new Error('Method not implemented.');
  }

  list(cond: UserCondDTO): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
}
