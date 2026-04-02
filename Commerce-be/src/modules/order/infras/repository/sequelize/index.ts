import { Sequelize } from 'sequelize';
import { IOrderRepository } from '../../../interface';
import { Order, OrderItem } from '../../../model/order';
import { UpdateOrderStatusDTO, OrderCondDTO } from '../../../model/dto';
import { PagingDTO } from '../../../../../share/model/paging';

export class MYSQLOrderRepository implements IOrderRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly orderModelName: string,
    private readonly orderItemModelName: string
  ) {}

  private toOrderEntity(raw: any, items?: OrderItem[]): Order {
    return {
      ...raw,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
      items: items || [],
    } as Order;
  }

  private toOrderItemEntity(raw: any): OrderItem {
    return {
      ...raw,
      price: parseFloat(raw.price),
    } as OrderItem;
  }

  async insert(order: Order, items: OrderItem[]): Promise<boolean> {
    const t = await this.sequelize.transaction();
    try {
      await this.sequelize.models[this.orderModelName].create(order as any, { transaction: t });
      if (items.length > 0) {
        await this.sequelize.models[this.orderItemModelName].bulkCreate(items as any[], { transaction: t });
      }
      await t.commit();
      return true;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getById(id: string): Promise<Order | null> {
    const data = await this.sequelize.models[this.orderModelName].findByPk(id);
    if (!data) return null;

    const itemRows = await this.sequelize.models[this.orderItemModelName].findAll({
      where: { orderId: id } as any,
    });

    const items = itemRows.map((row) => this.toOrderItemEntity(row.get({ plain: true })));
    return this.toOrderEntity(data.get({ plain: true }), items);
  }

  async list(cond: OrderCondDTO, paging: PagingDTO): Promise<Order[]> {
    const { page, limit } = paging;

    const rows = await this.sequelize.models[this.orderModelName].findAll({
      where: cond as any,
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'DESC']],
    });

    return rows.map((row) => this.toOrderEntity(row.get({ plain: true })));
  }

  async count(cond: OrderCondDTO): Promise<number> {
    return await this.sequelize.models[this.orderModelName].count({ where: cond as any });
  }

  async updateStatus(id: string, data: UpdateOrderStatusDTO): Promise<boolean> {
    await this.sequelize.models[this.orderModelName].update(data as any, { where: { id } });
    return true;
  }
}
