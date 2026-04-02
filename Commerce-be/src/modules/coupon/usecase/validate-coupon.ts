import { IQueryHandler } from '../../../share/interface';
import { ValidateCouponQuery, ICouponRepository } from '../interface';
import { Coupon, CouponType } from '../model/coupon';
import { ModelStatus } from '../../../share/model/base-model';
import {
  ErrCouponNotFound,
  ErrCouponExpired,
  ErrCouponNotStarted,
  ErrCouponUsageLimitReached,
  ErrCouponMinOrderNotMet,
  ErrCouponInactive,
} from '../model/errors';

export interface CouponValidationResult {
  coupon: Coupon;
  discountAmount: number;
}

export class ValidateCouponQueryHandler implements IQueryHandler<ValidateCouponQuery, CouponValidationResult> {
  constructor(private readonly repository: ICouponRepository) {}

  async query(query: ValidateCouponQuery): Promise<CouponValidationResult> {
    const coupon = await this.repository.findByCode(query.code.toUpperCase());
    if (!coupon || coupon.status === ModelStatus.DELETED) {
      throw ErrCouponNotFound;
    }

    if (coupon.status === ModelStatus.INACTIVE) {
      throw ErrCouponInactive;
    }

    const now = new Date();
    if (now < coupon.startDate) {
      throw ErrCouponNotStarted;
    }
    if (now > coupon.endDate) {
      throw ErrCouponExpired;
    }

    if (coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usageCount >= coupon.usageLimit) {
      throw ErrCouponUsageLimitReached;
    }

    if (query.orderTotal < coupon.minOrderValue) {
      throw ErrCouponMinOrderNotMet;
    }

    let discountAmount: number;
    if (coupon.type === CouponType.PERCENT) {
      discountAmount = (query.orderTotal * coupon.value) / 100;
      if (coupon.maxDiscount !== null && coupon.maxDiscount !== undefined && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.value;
    }

    if (discountAmount > query.orderTotal) {
      discountAmount = query.orderTotal;
    }

    return { coupon, discountAmount: Math.round(discountAmount * 100) / 100 };
  }
}
