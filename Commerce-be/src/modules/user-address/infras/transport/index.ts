import { Request, Response } from 'express';
import { ICommandHandler, IQueryHandler } from '../../../../share/interface';
import { CreateAddressCommand, DeleteAddressCommand, ListAddressesQuery, SetDefaultAddressCommand, UpdateAddressCommand } from '../../interface';
import { UserAddress } from '../../model/user-address';

export class UserAddressHttpService {
  constructor(
    private readonly createCmdHandler: ICommandHandler<CreateAddressCommand, string>,
    private readonly updateCmdHandler: ICommandHandler<UpdateAddressCommand, void>,
    private readonly deleteCmdHandler: ICommandHandler<DeleteAddressCommand, void>,
    private readonly setDefaultCmdHandler: ICommandHandler<SetDefaultAddressCommand, void>,
    private readonly listQueryHandler: IQueryHandler<ListAddressesQuery, UserAddress[]>
  ) {}

  async createAPI(req: Request, res: Response) {
    try {
      const userId = (req as any).requester.userId;
      const result = await this.createCmdHandler.execute({ userId, dto: req.body });
      res.status(201).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async updateAPI(req: Request, res: Response) {
    try {
      const userId = (req as any).requester.userId;
      await this.updateCmdHandler.execute({ id: req.params.id, userId, dto: req.body });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async deleteAPI(req: Request, res: Response) {
    try {
      const userId = (req as any).requester.userId;
      await this.deleteCmdHandler.execute({ id: req.params.id, userId });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async setDefaultAPI(req: Request, res: Response) {
    try {
      const userId = (req as any).requester.userId;
      await this.setDefaultCmdHandler.execute({ id: req.params.id, userId });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async listAPI(req: Request, res: Response) {
    try {
      const userId = (req as any).requester.userId;
      const result = await this.listQueryHandler.query({ userId });
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
