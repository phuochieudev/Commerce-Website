import { PagingDTO } from '../../../share/model/paging';
import { Coupon } from '../model/coupon';
import { CouponCondDTO, CouponCreateDTO, CouponUpdateDTO } from '../model/dto';

export interface ICouponRepository {
  get(id: string): Promise<Coupon | null>;
  findByCode(code: string): Promise<Coupon | null>;
  list(cond: CouponCondDTO, paging: PagingDTO): Promise<Coupon[]>;
  count(cond: CouponCondDTO): Promise<number>;
  insert(data: Coupon): Promise<boolean>;
  update(id: string, data: CouponUpdateDTO): Promise<boolean>;
  incrementUsage(id: string): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

export interface CreateCouponCommand {
  dto: CouponCreateDTO;
}

export interface UpdateCouponCommand {
  id: string;
  dto: CouponUpdateDTO;
}

export interface DeleteCouponCommand {
  id: string;
}

export interface GetCouponDetailQuery {
  id: string;
}

export interface ListCouponsQuery {
  cond: CouponCondDTO;
  paging: PagingDTO;
}

export interface ValidateCouponQuery {
  code: string;
  orderTotal: number;
}
