import { Request, Response } from 'express';
import { ICommandHandler, IQueryHandler } from '../../../../share/interface';
import { PagingDTOSchema } from '../../../../share/model/paging';
import {
  CreateOrderCommand,
  GetOrderDetailQuery,
  ListOrdersQuery,
  UpdateOrderStatusCommand,
  CancelOrderCommand,
} from '../../interface';
import { CreateOrderDTOSchema, UpdateOrderStatusDTOSchema } from '../../model/dto';
import { Order } from '../../model/order';

export class OrderHttpService {
  constructor(
    private readonly createHandler: ICommandHandler<CreateOrderCommand, string>,
    private readonly getDetailHandler: IQueryHandler<GetOrderDetailQuery, Order>,
    private readonly listHandler: IQueryHandler<ListOrdersQuery, Order[]>,
    private readonly updateStatusHandler: ICommandHandler<UpdateOrderStatusCommand, void>,
    private readonly cancelHandler: ICommandHandler<CancelOrderCommand, void>
  ) {}

  async createAPI(req: Request, res: Response) {
    try {
      const requester = (req as any).requester;
      const { success, data, error } = CreateOrderDTOSchema.safeParse(req.body);
      if (!success) {
        res.status(400).json({ message: error.message });
        return;
      }

      const result = await this.createHandler.execute({ userId: requester.userId, dto: data });
      res.status(201).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async getDetailAPI(req: Request, res: Response) {
    try {
      const requester = (req as any).requester;
      const { id } = req.params;
      const result = await this.getDetailHandler.query({
        userId: requester.userId,
        orderId: id,
        isAdmin: requester.role === 'admin',
      });
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }

  async listAPI(req: Request, res: Response) {
    try {
      const requester = (req as any).requester;
      const { success, data: paging, error } = PagingDTOSchema.safeParse(req.query);
      if (!success) {
        res.status(400).json({ message: 'Invalid paging', errors: error.message });
        return;
      }

      const result = await this.listHandler.query({
        userId: requester.userId,
        isAdmin: requester.role === 'admin',
        paging,
      });
      res.status(200).json({ data: result, paging });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async updateStatusAPI(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { success, data, error } = UpdateOrderStatusDTOSchema.safeParse(req.body);
      if (!success) {
        res.status(400).json({ message: error.message });
        return;
      }

      await this.updateStatusHandler.execute({ orderId: id, dto: data });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async cancelAPI(req: Request, res: Response) {
    try {
      const requester = (req as any).requester;
      const { id } = req.params;

      await this.cancelHandler.execute({ userId: requester.userId, orderId: id });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
