import { v7 } from 'uuid';
import crypto from 'crypto';
import { ICommandHandler } from '../../../share/interface';
import { CreateOrderCommand, IOrderRepository, IProductQueryForOrder, ICouponServiceForOrder } from '../interface';
import { CreateOrderDTOSchema } from '../model/dto';
import { Order, OrderItem, OrderStatus, PaymentStatus } from '../model/order';
import { ErrProductNotFound, ErrInsufficientStock } from '../model/errors';

export class CreateOrderCmdHandler implements ICommandHandler<CreateOrderCommand, string> {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productQuery: IProductQueryForOrder,
    private readonly couponService?: ICouponServiceForOrder
  ) {}

  async execute(command: CreateOrderCommand): Promise<string> {
    const { success, data } = CreateOrderDTOSchema.safeParse(command.dto);
    if (!success) {
      throw new Error('Invalid data');
    }

    const orderId = v7();
    const trackingNumber = crypto.randomBytes(8).toString('hex').toUpperCase().slice(0, 15);
    const orderItems: OrderItem[] = [];

    for (const item of data.items) {
      const product = await this.productQuery.get(item.productId);
      if (!product || product.status === 'deleted') {
        throw ErrProductNotFound;
      }

      if (product.quantity < item.quantity) {
        throw ErrInsufficientStock;
      }

      const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
      const image = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null;

      orderItems.push({
        id: v7(),
        orderId,
        productId: item.productId,
        attribute: item.attribute,
        image,
        name: product.name,
        quantity: item.quantity,
        price,
      });
    }

    // Calculate subtotal from items
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Apply coupon if provided
    let couponId: string | null = null;
    let discountAmount = 0;

    if (data.couponCode && this.couponService) {
      const couponResult = await this.couponService.validate(data.couponCode, subtotal);
      couponId = couponResult.couponId;
      discountAmount = couponResult.discountAmount;
    }

    const totalAmount = Math.round((subtotal - discountAmount) * 100) / 100;

    const order: Order = {
      id: orderId,
      userId: command.userId,
      shippingAddress: data.shippingAddress,
      shippingCity: data.shippingCity,
      shippingMethod: data.shippingMethod,
      paymentMethod: data.paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
      recipientFirstName: data.recipientFirstName,
      recipientLastName: data.recipientLastName,
      recipientPhone: data.recipientPhone,
      recipientEmail: data.recipientEmail,
      trackingNumber,
      couponId,
      discountAmount,
      totalAmount,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.orderRepository.insert(order, orderItems);

    // Increment coupon usage after successful order creation
    if (couponId && this.couponService) {
      await this.couponService.incrementUsage(couponId);
    }

    return orderId;
  }
}
