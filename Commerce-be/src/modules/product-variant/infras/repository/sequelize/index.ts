import { Sequelize, Op } from 'sequelize';
import { ProductVariant } from '../../../model/product-variant';
import { ProductVariantCondDTO, ProductVariantUpdateDTO } from '../../../model/dto';
import { IProductVariantRepository } from '../../../interface';
import { PagingDTO } from '../../../../../share/model/paging';
import { ModelStatus } from '../../../../../share/model/base-model';

export class MYSQLProductVariantRepository implements IProductVariantRepository {
  constructor(private readonly sequelize: Sequelize, private readonly modelName: string) {}

  private toEntity(data: any): ProductVariant {
    const plain = data.get ? data.get({ plain: true }) : data;
    return {
      ...plain,
      price: parseFloat(plain.price),
      salePrice: plain.salePrice || plain.sale_price ? parseFloat(plain.salePrice || plain.sale_price) : null,
      createdAt: plain.created_at || plain.createdAt,
      updatedAt: plain.updated_at || plain.updatedAt,
    };
  }

  async get(id: string): Promise<ProductVariant | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id);
    if (!data) return null;
    return this.toEntity(data);
  }

  async findBySku(sku: string): Promise<ProductVariant | null> {
    const data = await this.sequelize.models[this.modelName].findOne({ where: { sku } });
    if (!data) return null;
    return this.toEntity(data);
  }

  async list(cond: ProductVariantCondDTO, paging: PagingDTO): Promise<ProductVariant[]> {
    const { page, limit } = paging;
    const where: any = { status: { [Op.ne]: ModelStatus.DELETED } };
    if (cond.productId) where.productId = cond.productId;
    if (cond.status) where.status = cond.status;

    const rows = await this.sequelize.models[this.modelName].findAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'DESC']],
    });
    return rows.map((r) => this.toEntity(r));
  }

  async count(cond: ProductVariantCondDTO): Promise<number> {
    const where: any = { status: { [Op.ne]: ModelStatus.DELETED } };
    if (cond.productId) where.productId = cond.productId;
    if (cond.status) where.status = cond.status;
    return await this.sequelize.models[this.modelName].count({ where });
  }

  async insert(data: ProductVariant): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data as any);
    return true;
  }

  async update(id: string, data: ProductVariantUpdateDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(data as any, { where: { id } });
    return true;
  }

  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].update({ status: ModelStatus.DELETED }, { where: { id } });
    return true;
  }
}
