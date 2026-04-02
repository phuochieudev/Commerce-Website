import { Sequelize } from 'sequelize';
import { UserAddress, AddressStatus } from '../../../model/user-address';
import { UserAddressCondDTO, UserAddressUpdateDTO } from '../../../model/dto';
import { IUserAddressRepository } from '../../../interface';

export class MYSQLUserAddressRepository implements IUserAddressRepository {
  constructor(private readonly sequelize: Sequelize, private readonly modelName: string) {}

  private toEntity(data: any): UserAddress {
    const plain = data.get ? data.get({ plain: true }) : data;
    return {
      ...plain,
      isDefault: !!plain.isDefault || !!plain.is_default,
      createdAt: plain.created_at || plain.createdAt,
      updatedAt: plain.updated_at || plain.updatedAt,
    };
  }

  async get(id: string): Promise<UserAddress | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id);
    if (!data) return null;
    return this.toEntity(data);
  }

  async list(cond: UserAddressCondDTO): Promise<UserAddress[]> {
    const where: any = { status: AddressStatus.ACTIVE };
    if (cond.userId) where.userId = cond.userId;

    const rows = await this.sequelize.models[this.modelName].findAll({
      where,
      order: [['is_default', 'DESC'], ['id', 'DESC']],
    });
    return rows.map((r) => this.toEntity(r));
  }

  async insert(data: UserAddress): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data as any);
    return true;
  }

  async update(id: string, data: UserAddressUpdateDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(data as any, { where: { id } });
    return true;
  }

  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].update({ status: AddressStatus.DELETED }, { where: { id } });
    return true;
  }

  async clearDefault(userId: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(
      { isDefault: false },
      { where: { userId, isDefault: true } }
    );
    return true;
  }
}
