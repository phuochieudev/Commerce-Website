import { Sequelize, Op } from 'sequelize';
import {
  BaseRepositorySequelize,
  BaseQueryRepositorySequelize,
  BaseCommandRepositorySequelize,
} from '../../../../../share/repository/repo-sequelize';
import { PagingDTO } from '../../../../../share/model/paging';
import { ModelStatus } from '../../../../../share/model/base-model';
import { Product } from '../../../model/product';
import { ProductCondDTO, ProductUpdateDTO } from '../../../model/dto';

export class MYSQLProductRepository extends BaseRepositorySequelize<Product, ProductCondDTO, ProductUpdateDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(
      new MYSQLProductQueryRepository(sequelize, modelName),
      new MYSQLProductCommandRepository(sequelize, modelName)
    );
  }
}

export class MYSQLProductQueryRepository extends BaseQueryRepositorySequelize<Product, ProductCondDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName);
  }

  async get(id: string): Promise<Product | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id);
    if (!data) return null;
    return this.toEntity(data);
  }

  async list(cond: ProductCondDTO, paging: PagingDTO): Promise<Product[]> {
    const { page, limit } = paging;
    const { name, priceMin, priceMax, sort, gender, brandId, categoryId } = cond;

    const where: any = { status: { [Op.ne]: ModelStatus.DELETED } };
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (gender) where.gender = gender;
    if (brandId) where.brandId = brandId;
    if (categoryId) where.categoryId = categoryId;
    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) where.price[Op.gte] = priceMin;
      if (priceMax !== undefined) where.price[Op.lte] = priceMax;
    }

    let order: any = [['id', 'DESC']];
    if (sort === 'price_asc') order = [['price', 'ASC']];
    else if (sort === 'price_desc') order = [['price', 'DESC']];
    else if (sort === 'rating_desc') order = [['rating', 'DESC']];

    const total = await this.sequelize.models[this.modelName].count({ where });
    paging.total = total;

    const rows = await this.sequelize.models[this.modelName].findAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order,
    });

    return rows.map((row) => this.toEntity(row));
  }

  private toEntity(data: any): Product {
    const raw = data.get({ plain: true });
    return {
      ...raw,
      price: parseFloat(raw.price),
      salePrice: raw.salePrice ? parseFloat(raw.salePrice) : null,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    } as Product;
  }
}

export class MYSQLProductCommandRepository extends BaseCommandRepositorySequelize<Product, ProductUpdateDTO> {
  constructor(readonly sequelize: Sequelize, readonly modelName: string) {
    super(sequelize, modelName);
  }

  get(id: string): Promise<Product> {
    throw new Error('Method not implemented.');
  }

  findByCond(cond: ProductCondDTO): Promise<Product | null> {
    throw new Error('Method not implemented.');
  }

  list(cond: ProductCondDTO): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }
}
