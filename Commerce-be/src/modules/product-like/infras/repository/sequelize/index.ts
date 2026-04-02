import { Sequelize } from 'sequelize';
import { IProductLikeRepository } from '../../../interface';
import { ProductLike } from '../../../model/product-like';
import { PagingDTO } from '../../../../../share/model/paging';

export class MYSQLProductLikeRepository implements IProductLikeRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}

  async findByUserAndProduct(userId: string, productId: string): Promise<ProductLike | null> {
    const data = await this.sequelize.models[this.modelName].findOne({
      where: { userId, productId } as any,
    });
    if (!data) return null;
    return data.get({ plain: true }) as ProductLike;
  }

  async listByUserId(userId: string, paging: PagingDTO): Promise<ProductLike[]> {
    const { page, limit } = paging;
    const rows = await this.sequelize.models[this.modelName].findAll({
      where: { userId } as any,
      limit,
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']],
    });
    return rows.map((row) => row.get({ plain: true }) as ProductLike);
  }

  async countByUserId(userId: string): Promise<number> {
    return await this.sequelize.models[this.modelName].count({ where: { userId } as any });
  }

  async countByProductId(productId: string): Promise<number> {
    return await this.sequelize.models[this.modelName].count({ where: { productId } as any });
  }

  async insert(data: ProductLike): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data as any);
    return true;
  }

  async delete(userId: string, productId: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({
      where: { userId, productId } as any,
    });
    return true;
  }
}
