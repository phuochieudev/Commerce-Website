import { IQueryHandler } from '../../../share/interface';
import { ListCouponsQuery, ICouponRepository } from '../interface';
import { Coupon } from '../model/coupon';

export class ListCouponsQueryHandler implements IQueryHandler<ListCouponsQuery, Coupon[]> {
  constructor(private readonly repository: ICouponRepository) {}

  async query(query: ListCouponsQuery): Promise<Coupon[]> {
    const total = await this.repository.count(query.cond);
    query.paging.total = total;
    return await this.repository.list(query.cond, query.paging);
  }
}
