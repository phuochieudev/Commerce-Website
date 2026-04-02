import { Sequelize } from 'sequelize';
import {
  BaseRepositorySequelize,
  BaseQueryRepositorySequelize,
  BaseCommandRepositorySequelize,
} from '../../../../../share/repository/repo-sequelize';
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
