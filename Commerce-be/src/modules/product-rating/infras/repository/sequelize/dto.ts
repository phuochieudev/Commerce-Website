import { DataTypes, Model, Sequelize } from 'sequelize';

export class ProductRatingPersistence extends Model {}

export const modelName = 'ProductRating';

export function init(sequelize: Sequelize) {
  ProductRatingPersistence.init(
    {
      userId: { type: DataTypes.STRING, field: 'user_id', primaryKey: true },
      productId: { type: DataTypes.STRING, field: 'product_id', primaryKey: true },
      content: { type: DataTypes.TEXT, allowNull: true },
      createdAt: { type: DataTypes.DATE(6), field: 'created_at', allowNull: true },
      updated: { type: DataTypes.DATE(6), field: 'updated', allowNull: true },
    },
    {
      sequelize,
      modelName,
      timestamps: false,
      tableName: 'product_ratings',
    }
  );
}
