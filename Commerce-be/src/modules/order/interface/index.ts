import { PagingDTO } from '../../../share/model/paging';
import { Order, OrderItem } from '../model/order';
import { CreateOrderDTO, UpdateOrderStatusDTO, OrderCondDTO } from '../model/dto';

export interface IOrderRepository {
  insert(order: Order, items: OrderItem[]): Promise<boolean>;
  getById(id: string): Promise<Order | null>;
  list(cond: OrderCondDTO, paging: PagingDTO): Promise<Order[]>;
  count(cond: OrderCondDTO): Promise<number>;
  updateStatus(id: string, data: UpdateOrderStatusDTO): Promise<boolean>;
}

export interface IProductQueryForOrder {
  get(id: string): Promise<{
    id: string;
    name: string;
    price: number;
    salePrice?: number | null;
    images?: any;
    quantity: number;
    status: string;
  } | null>;
}

export interface ICouponServiceForOrder {
  validate(code: string, orderTotal: number): Promise<{ couponId: string; discountAmount: number }>;
  incrementUsage(couponId: string): Promise<boolean>;
}

export interface CreateOrderCommand {
  userId: string;
  dto: CreateOrderDTO;
}

export interface GetOrderDetailQuery {
  userId: string;
  orderId: string;
  isAdmin: boolean;
}

export interface ListOrdersQuery {
  userId: string;
  isAdmin: boolean;
  paging: PagingDTO;
}

export interface UpdateOrderStatusCommand {
  orderId: string;
  dto: UpdateOrderStatusDTO;
}

export interface CancelOrderCommand {
  userId: string;
  orderId: string;
}
