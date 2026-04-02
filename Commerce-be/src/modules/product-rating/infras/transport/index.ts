import { Request, Response } from 'express';
import { ICommandHandler, IQueryHandler } from '../../../../share/interface';
import { PagingDTOSchema } from '../../../../share/model/paging';
import { CreateRatingCommand, UpdateRatingCommand, DeleteRatingCommand, ListRatingsQuery } from '../../interface';
import { CreateRatingDTOSchema, UpdateRatingDTOSchema } from '../../model/dto';
import { ProductRating } from '../../model/product-rating';

export class ProductRatingHttpService {
  constructor(
    private readonly createHandler: ICommandHandler<CreateRatingCommand, void>,
    private readonly updateHandler: ICommandHandler<UpdateRatingCommand, void>,
    private readonly deleteHandler: ICommandHandler<DeleteRatingCommand, void>,
    private readonly listHandler: IQueryHandler<ListRatingsQuery, ProductRating[]>
  ) {}

  async createAPI(req: Request, res: Response) {
    try {
      const requester = (req as any).requester;
      const { productId } = req.params;
      const { success, data, error } = CreateRatingDTOSchema.safeParse(req.body);
      if (!success) {
        res.status(400).json({ message: error.message });
        return;
      }
      await this.createHandler.execute({ userId: requester.userId, productId, dto: data });
      res.status(201).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async updateAPI(req: Request, res: Response) {
    try {
      const requester = (req as any).requester;
      const { productId } = req.params;
      const { success, data, error } = UpdateRatingDTOSchema.safeParse(req.body);
      if (!success) {
        res.status(400).json({ message: error.message });
        return;
      }
      await this.updateHandler.execute({ userId: requester.userId, productId, dto: data });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async deleteAPI(req: Request, res: Response) {
    try {
      const requester = (req as any).requester;
      const { productId } = req.params;
      await this.deleteHandler.execute({ userId: requester.userId, productId });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async listAPI(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const { success, data: paging, error } = PagingDTOSchema.safeParse(req.query);
      if (!success) {
        res.status(400).json({ message: 'Invalid paging', errors: error.message });
        return;
      }
      const result = await this.listHandler.query({ productId, paging });
      res.status(200).json({ data: result, paging });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
