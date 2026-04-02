import { Request, Response } from 'express';
import { ICommandHandler, IQueryHandler } from '../../../../share/interface';
import { CreateVariantCommand, DeleteVariantCommand, GetVariantDetailQuery, ListVariantsQuery, UpdateVariantCommand } from '../../interface';
import { ProductVariant } from '../../model/product-variant';
import { PagingDTOSchema } from '../../../../share/model/paging';

export class ProductVariantHttpService {
  constructor(
    private readonly createCmdHandler: ICommandHandler<CreateVariantCommand, string>,
    private readonly getDetailQueryHandler: IQueryHandler<GetVariantDetailQuery, ProductVariant>,
    private readonly updateCmdHandler: ICommandHandler<UpdateVariantCommand, void>,
    private readonly deleteCmdHandler: ICommandHandler<DeleteVariantCommand, void>,
    private readonly listQueryHandler: IQueryHandler<ListVariantsQuery, ProductVariant[]>
  ) {}

  async createAPI(req: Request, res: Response) {
    try {
      const result = await this.createCmdHandler.execute({ productId: req.params.productId, dto: req.body });
      res.status(201).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async getDetailAPI(req: Request, res: Response) {
    try {
      const result = await this.getDetailQueryHandler.query({ id: req.params.variantId });
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }

  async updateAPI(req: Request, res: Response) {
    try {
      await this.updateCmdHandler.execute({ id: req.params.variantId, dto: req.body });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async deleteAPI(req: Request, res: Response) {
    try {
      await this.deleteCmdHandler.execute({ id: req.params.variantId });
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

    const cond = { productId: req.params.productId };
    const result = await this.listQueryHandler.query({ cond, paging });
    res.status(200).json({ data: result, paging, filter: cond });
  }
}
