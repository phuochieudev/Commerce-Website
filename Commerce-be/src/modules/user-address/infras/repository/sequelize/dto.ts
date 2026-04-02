import { DataTypes, Model, Sequelize } from 'sequelize';

export class UserAddressPersistence extends Model {
  declare id: string;
  declare status: string;
}

export const modelName = 'UserAddress';

export function init(sequelize: Sequelize) {
  UserAddressPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING,
        field: 'user_id',
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recipientName: {
        type: DataTypes.STRING,
        field: 'recipient_name',
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isDefault: {
        type: DataTypes.BOOLEAN,
        field: 'is_default',
        allowNull: false,
        defaultValue: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'deleted'),
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
      tableName: 'user_addresses',
    }
  );
}
