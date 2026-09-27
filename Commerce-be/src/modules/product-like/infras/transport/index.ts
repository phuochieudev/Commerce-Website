import { Request, Response } from 'express';
import { ICommandHandler, IQueryHandler } from '../../../../share/interface';
import { PagingDTOSchema } from '../../../../share/model/paging';
import { LikeProductCommand, UnlikeProductCommand, ListLikedProductsQuery } from '../../interface';
import { ProductLike } from '../../model/product-like';
import { GetLikeStatusQuery, LikeStatus } from '../../usecase/get-like-status';
import { z } from 'zod';

const ProductIdParamSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
});

export class ProductLikeHttpService {
  constructor(
    private readonly likeHandler: ICommandHandler<LikeProductCommand, void>,
    private readonly unlikeHandler: ICommandHandler<UnlikeProductCommand, void>,
    private readonly listHandler: IQueryHandler<ListLikedProductsQuery, ProductLike[]>,
    private readonly likeStatusHandler: IQueryHandler<GetLikeStatusQuery, LikeStatus>
  ) {}

  async likeStatusAPI(req: Request, res: Response) {
    try {
      const requester = (req as any).requester;
      const { success, data, error } = ProductIdParamSchema.safeParse(req.params);
      if (!success) {
        res.status(400).json({ message: error.message });
        return;
      }
      const result = await this.likeStatusHandler.query({ userId: requester.userId, productId: data.productId });
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async likeAPI(req: Request, res: Response) {
    try {
      const requester = (req as any).requester;
      const { success, data, error } = ProductIdParamSchema.safeParse(req.params);
      if (!success) {
        res.status(400).json({ message: error.message });
        return;
      }
      await this.likeHandler.execute({ userId: requester.userId, productId: data.productId });
      res.status(201).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async unlikeAPI(req: Request, res: Response) {
    try {
      const requester = (req as any).requester;
      const { success, data, error } = ProductIdParamSchema.safeParse(req.params);
      if (!success) {
        res.status(400).json({ message: error.message });
        return;
      }
      await this.unlikeHandler.execute({ userId: requester.userId, productId: data.productId });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
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
      const result = await this.listHandler.query({ userId: requester.userId, paging });
      res.status(200).json({ data: result, paging });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
