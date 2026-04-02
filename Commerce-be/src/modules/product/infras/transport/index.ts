import { Request, Response } from 'express';
import { ICommandHandler, IQueryHandler } from '../../../../share/interface';
import { PagingDTOSchema } from '../../../../share/model/paging';
import {
  CreateProductCommand,
  GetProductDetailQuery,
  UpdateProductCommand,
  DeleteProductCommand,
  ListProductQuery,
} from '../../interface';
import { ProductCreateDTOSchema, ProductUpdateDTOSchema, ProductCondDTOSchema } from '../../model/dto';
import { Product } from '../../model/product';

export class ProductHttpService {
  constructor(
    private readonly createHandler: ICommandHandler<CreateProductCommand, string>,
    private readonly getDetailHandler: IQueryHandler<GetProductDetailQuery, Product>,
    private readonly updateHandler: ICommandHandler<UpdateProductCommand, void>,
    private readonly deleteHandler: ICommandHandler<DeleteProductCommand, void>,
    private readonly listHandler: IQueryHandler<ListProductQuery, Product[]>
  ) {}

  async createAPI(req: Request, res: Response) {
    try {
      const { success, data, error } = ProductCreateDTOSchema.safeParse(req.body);
      if (!success) {
        res.status(400).json({ message: error.message });
        return;
      }

      const result = await this.createHandler.execute({ dto: data });
      res.status(201).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async getDetailAPI(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.getDetailHandler.query({ id });
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }

  async updateAPI(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { success, data, error } = ProductUpdateDTOSchema.safeParse(req.body);
      if (!success) {
        res.status(400).json({ message: error.message });
        return;
      }

      await this.updateHandler.execute({ id, dto: data });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async deleteAPI(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.deleteHandler.execute({ id, isHardDelete: false });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async listAPI(req: Request, res: Response) {
    try {
      const { success: pagingOk, data: paging, error: pagingErr } = PagingDTOSchema.safeParse(req.query);
      if (!pagingOk) {
        res.status(400).json({ message: 'Invalid paging', errors: pagingErr.message });
        return;
      }

      const cond = ProductCondDTOSchema.parse(req.query);
      const result = await this.listHandler.query({ cond, paging });
      res.status(200).json({ data: result, paging, filter: cond });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
