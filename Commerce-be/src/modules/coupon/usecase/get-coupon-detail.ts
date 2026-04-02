import { IQueryHandler } from '../../../share/interface';
import { GetCouponDetailQuery, ICouponRepository } from '../interface';
import { Coupon } from '../model/coupon';
import { ErrCouponNotFound } from '../model/errors';
import { ModelStatus } from '../../../share/model/base-model';

export class GetCouponDetailQueryHandler implements IQueryHandler<GetCouponDetailQuery, Coupon> {
  constructor(private readonly repository: ICouponRepository) {}

  async query(query: GetCouponDetailQuery): Promise<Coupon> {
    const data = await this.repository.get(query.id);
    if (!data || data.status === ModelStatus.DELETED) {
      throw ErrCouponNotFound;
    }
    return data;
  }
}
