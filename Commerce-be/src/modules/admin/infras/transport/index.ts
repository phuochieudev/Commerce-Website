import { Request, Response } from 'express';
import { IQueryHandler } from '../../../../share/interface';
import { DashboardStats } from '../../usecase/get-dashboard-stats';

export class AdminHttpService {
  constructor(private readonly statsHandler: IQueryHandler<{}, DashboardStats>) {}

  async getStatsAPI(req: Request, res: Response) {
    try {
      const result = await this.statsHandler.query({});
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
