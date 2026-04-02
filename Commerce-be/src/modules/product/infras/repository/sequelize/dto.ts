import { DataTypes, Model, Sequelize } from 'sequelize';

export class ProductPersistence extends Model {
  declare id: string;
  declare status: string;
}

export const modelName = 'Product';

export function init(sequelize: Sequelize) {
  ProductPersistence.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'unisex'),
        allowNull: false,
        defaultValue: 'unisex',
      },
      images: { type: DataTypes.JSON, allowNull: true },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      salePrice: { type: DataTypes.DECIMAL(10, 2), field: 'sale_price', allowNull: true },
      colors: { type: DataTypes.STRING, allowNull: true },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      brandId: { type: DataTypes.STRING, field: 'brand_id', allowNull: false },
      categoryId: { type: DataTypes.STRING, field: 'category_id', allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      rating: { type: DataTypes.FLOAT, allowNull: true, defaultValue: 0 },
      saleCount: { type: DataTypes.INTEGER.UNSIGNED, field: 'sale_count', allowNull: true, defaultValue: 0 },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      sequelize,
      modelName,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      tableName: 'products',
    }
  );
}
