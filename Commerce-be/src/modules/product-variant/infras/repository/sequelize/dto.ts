import { DataTypes, Model, Sequelize } from 'sequelize';

export class ProductVariantPersistence extends Model {
  declare id: string;
  declare status: string;
}

export const modelName = 'ProductVariant';

export function init(sequelize: Sequelize) {
  ProductVariantPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.STRING,
        field: 'product_id',
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      salePrice: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'sale_price',
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
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
      tableName: 'product_variants',
    }
  );
}
