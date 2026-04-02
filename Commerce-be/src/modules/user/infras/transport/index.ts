import { Request, Response } from 'express';
import { ICommandHandler, IQueryHandler } from '../../../../share/interface';
import {
  RegisterCommand,
  LoginCommand,
  GetProfileQuery,
  UpdateProfileCommand,
  AuthResponse,
} from '../../interface';
import { RegisterDTOSchema, LoginDTOSchema, UpdateProfileDTOSchema } from '../../model/dto';
import { User } from '../../model/user';

export class UserHttpService {
  constructor(
    private readonly registerHandler: ICommandHandler<RegisterCommand, AuthResponse>,
    private readonly loginHandler: ICommandHandler<LoginCommand, AuthResponse>,
    private readonly getProfileHandler: IQueryHandler<GetProfileQuery, Omit<User, 'password' | 'salt'>>,
    private readonly updateProfileHandler: ICommandHandler<UpdateProfileCommand, void>
  ) {}

  async registerAPI(req: Request, res: Response) {
    try {
      const { success, data, error } = RegisterDTOSchema.safeParse(req.body);
      if (!success) {
        res.status(400).json({ message: error.message });
        return;
      }

      const result = await this.registerHandler.execute({ dto: data });
      res.status(201).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async loginAPI(req: Request, res: Response) {
    try {
      const { success, data, error } = LoginDTOSchema.safeParse(req.body);
      if (!success) {
        res.status(400).json({ message: error.message });
        return;
      }

      const result = await this.loginHandler.execute({ dto: data });
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async getProfileAPI(req: Request, res: Response) {
    try {
      const requester = (req as any).requester;
      const result = await this.getProfileHandler.query({ userId: requester.userId });
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async updateProfileAPI(req: Request, res: Response) {
    try {
      const requester = (req as any).requester;
      const { success, data, error } = UpdateProfileDTOSchema.safeParse(req.body);
      if (!success) {
        res.status(400).json({ message: error.message });
        return;
      }

      await this.updateProfileHandler.execute({ userId: requester.userId, dto: data });
      res.status(200).json({ data: true });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
