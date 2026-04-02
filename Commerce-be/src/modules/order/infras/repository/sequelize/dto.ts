import { DataTypes, Model, Sequelize } from 'sequelize';

export class OrderPersistence extends Model {
  declare id: string;
  declare status: string;
}

export class OrderItemPersistence extends Model {
  declare id: string;
}

export const orderModelName = 'Order';
export const orderItemModelName = 'OrderItem';

export function init(sequelize: Sequelize) {
  OrderPersistence.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      userId: { type: DataTypes.STRING, field: 'user_id', allowNull: false },
      shippingAddress: { type: DataTypes.STRING, field: 'shipping_address', allowNull: true },
      shippingCity: { type: DataTypes.STRING, field: 'shipping_city', allowNull: true },
      shippingMethod: {
        type: DataTypes.ENUM('free', 'standard'),
        field: 'shipping_method',
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.ENUM('cod', 'zalo'),
        field: 'payment_method',
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.ENUM('pending', 'paid', 'failed'),
        field: 'payment_status',
        allowNull: false,
      },
      recipientFirstName: { type: DataTypes.STRING, field: 'recipient_first_name', allowNull: true },
      recipientLastName: { type: DataTypes.STRING, field: 'recipient_last_name', allowNull: true },
      recipientPhone: { type: DataTypes.STRING, field: 'recipient_phone', allowNull: true },
      recipientEmail: { type: DataTypes.STRING, field: 'recipient_email', allowNull: true },
      trackingNumber: { type: DataTypes.STRING, field: 'tracking_number', allowNull: true, unique: true },
      couponId: { type: DataTypes.STRING, field: 'coupon_id', allowNull: true },
      discountAmount: { type: DataTypes.DECIMAL(10, 2), field: 'discount_amount', allowNull: false, defaultValue: 0 },
      totalAmount: { type: DataTypes.DECIMAL(10, 2), field: 'total_amount', allowNull: false, defaultValue: 0 },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: orderModelName,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      tableName: 'orders',
    }
  );

  OrderItemPersistence.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      orderId: { type: DataTypes.STRING, field: 'order_id', allowNull: false },
      productId: { type: DataTypes.STRING, field: 'product_id', allowNull: false },
      attribute: { type: DataTypes.STRING, allowNull: false },
      image: { type: DataTypes.STRING, allowNull: true },
      name: { type: DataTypes.STRING, allowNull: true },
      quantity: { type: DataTypes.INTEGER, allowNull: false },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    {
      sequelize,
      modelName: orderItemModelName,
      timestamps: false,
      tableName: 'order_items',
    }
  );
}
