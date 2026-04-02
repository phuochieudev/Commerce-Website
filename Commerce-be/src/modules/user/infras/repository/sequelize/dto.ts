import { DataTypes, Model, Sequelize } from 'sequelize';

export class UserPersistence extends Model {
  declare id: string;
  declare status: string;
}

export const modelName = 'User';

export function init(sequelize: Sequelize) {
  UserPersistence.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      avatar: { type: DataTypes.STRING, allowNull: true },
      firstName: { type: DataTypes.STRING, field: 'first_name', allowNull: false },
      lastName: { type: DataTypes.STRING, field: 'last_name', allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      salt: { type: DataTypes.STRING, allowNull: true },
      phone: { type: DataTypes.STRING, allowNull: true },
      address: { type: DataTypes.STRING, allowNull: true },
      birthday: { type: DataTypes.DATEONLY, allowNull: true },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'unknown'),
        allowNull: false,
        defaultValue: 'male',
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user',
      },
      status: {
        type: DataTypes.ENUM('active', 'pending', 'inactive', 'banned', 'deleted'),
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
      tableName: 'users',
    }
  );
}
