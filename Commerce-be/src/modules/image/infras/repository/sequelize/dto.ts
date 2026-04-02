import { DataTypes, Model, Sequelize } from 'sequelize';

export class ImagePersistence extends Model {
  declare id: string;
  declare status: string;
}

export const modelName = 'Image';

export function init(sequelize: Sequelize) {
  ImagePersistence.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      path: { type: DataTypes.STRING, allowNull: false },
      cloudName: { type: DataTypes.STRING, field: 'cloud_name', allowNull: false },
      width: { type: DataTypes.INTEGER, allowNull: true },
      height: { type: DataTypes.INTEGER, allowNull: true },
      size: { type: DataTypes.INTEGER, allowNull: true },
      status: {
        type: DataTypes.ENUM('uploaded', 'used'),
        allowNull: true,
        defaultValue: 'uploaded',
      },
    },
    {
      sequelize,
      modelName,
      timestamps: true,
      tableName: 'images',
    }
  );
}
