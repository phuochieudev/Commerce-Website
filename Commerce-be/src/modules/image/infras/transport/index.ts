import { Request, Response } from 'express';
import { ICommandHandler, IQueryHandler } from '../../../../share/interface';
import { PagingDTOSchema } from '../../../../share/model/paging';
import { CreateImageCommand, DeleteImageCommand, ListImagesQuery } from '../../interface';
import { CreateImageDTOSchema } from '../../model/dto';
import { Image } from '../../model/image';

export class ImageHttpService {
  constructor(
    private readonly createHandler: ICommandHandler<CreateImageCommand, string>,
    private readonly deleteHandler: ICommandHandler<DeleteImageCommand, void>,
    private readonly listHandler: IQueryHandler<ListImagesQuery, Image[]>
  ) {}

  async createAPI(req: Request, res: Response) {
    try {
      const { success, data, error } = CreateImageDTOSchema.safeParse(req.body);
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

  async deleteAPI(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.deleteHandler.execute({ id });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async listAPI(req: Request, res: Response) {
    try {
      const { success, data: paging, error } = PagingDTOSchema.safeParse(req.query);
      if (!success) {
        res.status(400).json({ message: 'Invalid paging', errors: error.message });
        return;
      }
      const cond = {
        status: req.query.status as string | undefined,
        cloudName: req.query.cloudName as string | undefined,
      };
      const result = await this.listHandler.query({ cond, paging });
      res.status(200).json({ data: result, paging, filter: cond });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
