import { Sequelize, Op } from 'sequelize';
import { Coupon } from '../../../model/coupon';
import { CouponCondDTO, CouponUpdateDTO } from '../../../model/dto';
import { ICouponRepository } from '../../../interface';
import { PagingDTO } from '../../../../../share/model/paging';
import { ModelStatus } from '../../../../../share/model/base-model';

export class MYSQLCouponRepository implements ICouponRepository {
  constructor(private readonly sequelize: Sequelize, private readonly modelName: string) {}

  private toEntity(data: any): Coupon {
    const plain = data.get ? data.get({ plain: true }) : data;
    return {
      ...plain,
      value: parseFloat(plain.value),
      minOrderValue: parseFloat(plain.minOrderValue || plain.min_order_value || '0'),
      maxDiscount: plain.maxDiscount || plain.max_discount ? parseFloat(plain.maxDiscount || plain.max_discount) : null,
      createdAt: plain.created_at || plain.createdAt,
      updatedAt: plain.updated_at || plain.updatedAt,
    };
  }

  async get(id: string): Promise<Coupon | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id);
    if (!data) return null;
    return this.toEntity(data);
  }

  async findByCode(code: string): Promise<Coupon | null> {
    const data = await this.sequelize.models[this.modelName].findOne({ where: { code: code.toUpperCase() } });
    if (!data) return null;
    return this.toEntity(data);
  }

  async list(cond: CouponCondDTO, paging: PagingDTO): Promise<Coupon[]> {
    const { page, limit } = paging;
    const where: any = { status: { [Op.ne]: ModelStatus.DELETED } };
    if (cond.code) where.code = { [Op.like]: `%${cond.code}%` };
    if (cond.status) where.status = cond.status;

    const rows = await this.sequelize.models[this.modelName].findAll({
      where,
      limit,
      offset: (page - 1) * limit,
      order: [['id', 'DESC']],
    });
    return rows.map((r) => this.toEntity(r));
  }

  async count(cond: CouponCondDTO): Promise<number> {
    const where: any = { status: { [Op.ne]: ModelStatus.DELETED } };
    if (cond.code) where.code = { [Op.like]: `%${cond.code}%` };
    if (cond.status) where.status = cond.status;
    return await this.sequelize.models[this.modelName].count({ where });
  }

  async insert(data: Coupon): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data as any);
    return true;
  }

  async update(id: string, data: CouponUpdateDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(data as any, { where: { id } });
    return true;
  }

  async incrementUsage(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].increment('usage_count', { where: { id } });
    return true;
  }

  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].update({ status: ModelStatus.DELETED }, { where: { id } });
    return true;
  }
}
