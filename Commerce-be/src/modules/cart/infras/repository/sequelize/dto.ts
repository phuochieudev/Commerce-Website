import { DataTypes, Model, Sequelize } from 'sequelize';

export class CartPersistence extends Model {
  declare id: string;
}

export const modelName = 'Cart';

export function init(sequelize: Sequelize) {
  CartPersistence.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      userId: { type: DataTypes.STRING, field: 'user_id', allowNull: false },
      productId: { type: DataTypes.STRING, field: 'product_id', allowNull: false },
      attribute: { type: DataTypes.STRING, allowNull: false },
      quantity: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    },
    {
      sequelize,
      modelName,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      tableName: 'carts',
    }
  );
}
