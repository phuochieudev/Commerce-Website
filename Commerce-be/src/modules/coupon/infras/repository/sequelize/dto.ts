import { DataTypes, Model, Sequelize } from 'sequelize';

export class CouponPersistence extends Model {
  declare id: string;
  declare status: string;
}

export const modelName = 'Coupon';

export function init(sequelize: Sequelize) {
  CouponPersistence.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM('percent', 'fixed'),
        allowNull: false,
      },
      value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      minOrderValue: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'min_order_value',
        allowNull: false,
        defaultValue: 0,
      },
      maxDiscount: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'max_discount',
        allowNull: true,
      },
      usageLimit: {
        type: DataTypes.INTEGER,
        field: 'usage_limit',
        allowNull: true,
      },
      usageCount: {
        type: DataTypes.INTEGER,
        field: 'usage_count',
        allowNull: false,
        defaultValue: 0,
      },
      startDate: {
        type: DataTypes.DATE,
        field: 'start_date',
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        field: 'end_date',
        allowNull: false,
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
      tableName: 'coupons',
    }
  );
}
