import { DataTypes, Model, Sequelize } from 'sequelize';

export class ProductLikePersistence extends Model {}

export const modelName = 'ProductLike';

export function init(sequelize: Sequelize) {
  ProductLikePersistence.init(
    {
      userId: { type: DataTypes.STRING, field: 'user_id', primaryKey: true },
      productId: { type: DataTypes.STRING, field: 'product_id', primaryKey: true },
      createdAt: { type: DataTypes.DATE(6), field: 'created_at', allowNull: true },
    },
    {
      sequelize,
      modelName,
      timestamps: false,
      tableName: 'product_likes',
    }
  );
}
