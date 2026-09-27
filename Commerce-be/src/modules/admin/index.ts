import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { GetDashboardStatsQueryHandler } from './usecase/get-dashboard-stats';
import { AdminHttpService } from './infras/transport';
import { authMiddleware, adminMiddleware } from '../../share/middleware/authentication';

export const setupAdminHexagon = (sequelize: Sequelize) => {
  const statsHandler = new GetDashboardStatsQueryHandler(sequelize);
  const httpService = new AdminHttpService(statsHandler);

  const router = Router();

  router.get('/admin/stats', authMiddleware, adminMiddleware, httpService.getStatsAPI.bind(httpService));

  return router;
};
