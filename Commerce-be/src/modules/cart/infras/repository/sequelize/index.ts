import { Sequelize } from 'sequelize';
import { ICartRepository } from '../../../interface';
import { Cart } from '../../../model/cart';
import { UpdateCartDTO } from '../../../model/dto';
import { PagingDTO } from '../../../../../share/model/paging';

export class MYSQLCartRepository implements ICartRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}

  private toEntity(raw: any): Cart {
    return {
      ...raw,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    } as Cart;
  }

  async findById(id: string): Promise<Cart | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id);
    if (!data) return null;
    return this.toEntity(data.get({ plain: true }));
  }

  async findByUserProductAttribute(userId: string, productId: string, attribute: string): Promise<Cart | null> {
    const data = await this.sequelize.models[this.modelName].findOne({
      where: { userId, productId, attribute } as any,
    });
    if (!data) return null;
    return this.toEntity(data.get({ plain: true }));
  }

  async listByUserId(userId: string, paging: PagingDTO): Promise<Cart[]> {
    const { page, limit } = paging;

    const total = await this.sequelize.models[this.modelName].count({ where: { userId } as any });
    paging.total = total;

    const rows = await this.sequelize.models[this.modelName].findAll({
      where: { userId } as any,
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'DESC']],
    });

    return rows.map((row) => this.toEntity(row.get({ plain: true })));
  }

  async countByUserId(userId: string): Promise<number> {
    return await this.sequelize.models[this.modelName].count({ where: { userId } as any });
  }

  async insert(data: Cart): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data as any);
    return true;
  }

  async update(id: string, data: UpdateCartDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(data as any, { where: { id } });
    return true;
  }

  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({ where: { id } });
    return true;
  }
}
