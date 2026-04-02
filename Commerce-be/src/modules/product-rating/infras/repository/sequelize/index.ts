import { Sequelize } from 'sequelize';
import { IProductRatingRepository } from '../../../interface';
import { ProductRating } from '../../../model/product-rating';
import { UpdateRatingDTO } from '../../../model/dto';
import { PagingDTO } from '../../../../../share/model/paging';

export class MYSQLProductRatingRepository implements IProductRatingRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}

  async findByUserAndProduct(userId: string, productId: string): Promise<ProductRating | null> {
    const data = await this.sequelize.models[this.modelName].findOne({
      where: { userId, productId } as any,
    });
    if (!data) return null;
    return data.get({ plain: true }) as ProductRating;
  }

  async listByProductId(productId: string, paging: PagingDTO): Promise<ProductRating[]> {
    const { page, limit } = paging;
    const rows = await this.sequelize.models[this.modelName].findAll({
      where: { productId } as any,
      limit,
      offset: (page - 1) * limit,
      order: [['created_at', 'DESC']],
    });
    return rows.map((row) => row.get({ plain: true }) as ProductRating);
  }

  async countByProductId(productId: string): Promise<number> {
    return await this.sequelize.models[this.modelName].count({ where: { productId } as any });
  }

  async insert(data: ProductRating): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data as any);
    return true;
  }

  async update(userId: string, productId: string, data: UpdateRatingDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(
      { ...data, updated: new Date() } as any,
      { where: { userId, productId } as any }
    );
    return true;
  }

  async delete(userId: string, productId: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({
      where: { userId, productId } as any,
    });
    return true;
  }
}
