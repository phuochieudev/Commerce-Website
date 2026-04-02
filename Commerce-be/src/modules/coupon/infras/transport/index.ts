import { Request, Response } from 'express';
import { ICommandHandler, IQueryHandler } from '../../../../share/interface';
import { CreateCouponCommand, DeleteCouponCommand, GetCouponDetailQuery, ListCouponsQuery, UpdateCouponCommand, ValidateCouponQuery } from '../../interface';
import { Coupon } from '../../model/coupon';
import { PagingDTOSchema } from '../../../../share/model/paging';
import { CouponValidationResult } from '../../usecase/validate-coupon';

export class CouponHttpService {
  constructor(
    private readonly createCmdHandler: ICommandHandler<CreateCouponCommand, string>,
    private readonly getDetailQueryHandler: IQueryHandler<GetCouponDetailQuery, Coupon>,
    private readonly updateCmdHandler: ICommandHandler<UpdateCouponCommand, void>,
    private readonly deleteCmdHandler: ICommandHandler<DeleteCouponCommand, void>,
    private readonly listQueryHandler: IQueryHandler<ListCouponsQuery, Coupon[]>,
    private readonly validateQueryHandler: IQueryHandler<ValidateCouponQuery, CouponValidationResult>
  ) {}

  async createAPI(req: Request, res: Response) {
    try {
      const result = await this.createCmdHandler.execute({ dto: req.body });
      res.status(201).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async getDetailAPI(req: Request, res: Response) {
    try {
      const result = await this.getDetailQueryHandler.query({ id: req.params.id });
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }

  async updateAPI(req: Request, res: Response) {
    try {
      await this.updateCmdHandler.execute({ id: req.params.id, dto: req.body });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async deleteAPI(req: Request, res: Response) {
    try {
      await this.deleteCmdHandler.execute({ id: req.params.id });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async listAPI(req: Request, res: Response) {
    const { success, data: paging, error } = PagingDTOSchema.safeParse(req.query);
    if (!success) {
      res.status(400).json({ message: 'Invalid paging', error: error.message });
      return;
    }

    const cond = { code: req.query.code as string, status: req.query.status as string };
    const result = await this.listQueryHandler.query({ cond, paging });
    res.status(200).json({ data: result, paging, filter: cond });
  }

  async validateAPI(req: Request, res: Response) {
    try {
      const { code, orderTotal } = req.body;
      const result = await this.validateQueryHandler.query({ code, orderTotal });
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
