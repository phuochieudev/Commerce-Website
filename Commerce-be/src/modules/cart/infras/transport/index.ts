import { Request, Response } from 'express';
import { ICommandHandler, IQueryHandler } from '../../../../share/interface';
import { PagingDTOSchema } from '../../../../share/model/paging';
import { AddToCartCommand, UpdateCartCommand, RemoveCartItemCommand, ListCartQuery } from '../../interface';
import { AddToCartDTOSchema, UpdateCartDTOSchema } from '../../model/dto';
import { Cart } from '../../model/cart';

export class CartHttpService {
  constructor(
    private readonly addToCartHandler: ICommandHandler<AddToCartCommand, string>,
    private readonly updateCartHandler: ICommandHandler<UpdateCartCommand, void>,
    private readonly removeCartItemHandler: ICommandHandler<RemoveCartItemCommand, void>,
    private readonly listCartHandler: IQueryHandler<ListCartQuery, Cart[]>
  ) {}

  async addToCartAPI(req: Request, res: Response) {
    try {
      const requester = (req as any).requester;
      const { success, data, error } = AddToCartDTOSchema.safeParse(req.body);
      if (!success) {
        res.status(400).json({ message: error.message });
        return;
      }

      const result = await this.addToCartHandler.execute({ userId: requester.userId, dto: data });
      res.status(201).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async updateCartAPI(req: Request, res: Response) {
    try {
      const requester = (req as any).requester;
      const { id } = req.params;
      const { success, data, error } = UpdateCartDTOSchema.safeParse(req.body);
      if (!success) {
        res.status(400).json({ message: error.message });
        return;
      }

      await this.updateCartHandler.execute({ userId: requester.userId, cartItemId: id, dto: data });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async removeCartItemAPI(req: Request, res: Response) {
    try {
      const requester = (req as any).requester;
      const { id } = req.params;

      await this.removeCartItemHandler.execute({ userId: requester.userId, cartItemId: id });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async listCartAPI(req: Request, res: Response) {
    try {
      const requester = (req as any).requester;
      const { success, data: paging, error } = PagingDTOSchema.safeParse(req.query);
      if (!success) {
        res.status(400).json({ message: 'Invalid paging', errors: error.message });
        return;
      }

      const result = await this.listCartHandler.query({ userId: requester.userId, paging });
      res.status(200).json({ data: result, paging });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
