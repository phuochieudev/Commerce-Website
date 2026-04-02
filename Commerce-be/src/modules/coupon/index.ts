import { Sequelize } from 'sequelize';
import { Router } from 'express';
import { init, modelName } from './infras/repository/sequelize/dto';
import { MYSQLCouponRepository } from './infras/repository/sequelize';
import { CouponHttpService } from './infras/transport';
import { CreateCouponCmdHandler } from './usecase/create-coupon';
import { GetCouponDetailQueryHandler } from './usecase/get-coupon-detail';
import { UpdateCouponCmdHandler } from './usecase/update-coupon';
import { DeleteCouponCmdHandler } from './usecase/delete-coupon';
import { ListCouponsQueryHandler } from './usecase/list-coupons';
import { ValidateCouponQueryHandler } from './usecase/validate-coupon';
import { authMiddleware, adminMiddleware } from '../../share/middleware/authentication';

export const setupCouponHexagon = (sequelize: Sequelize) => {
  init(sequelize);

  const repository = new MYSQLCouponRepository(sequelize, modelName);

  const createCmdHandler = new CreateCouponCmdHandler(repository);
  const getDetailQueryHandler = new GetCouponDetailQueryHandler(repository);
  const updateCmdHandler = new UpdateCouponCmdHandler(repository);
  const deleteCmdHandler = new DeleteCouponCmdHandler(repository);
  const listQueryHandler = new ListCouponsQueryHandler(repository);
  const validateQueryHandler = new ValidateCouponQueryHandler(repository);

  const httpService = new CouponHttpService(
    createCmdHandler,
    getDetailQueryHandler,
    updateCmdHandler,
    deleteCmdHandler,
    listQueryHandler,
    validateQueryHandler
  );

  const router = Router();

  // Admin routes
  router.post('/coupons', authMiddleware, adminMiddleware, httpService.createAPI.bind(httpService));
  router.get('/coupons/:id', authMiddleware, adminMiddleware, httpService.getDetailAPI.bind(httpService));
  router.get('/coupons', authMiddleware, adminMiddleware, httpService.listAPI.bind(httpService));
  router.patch('/coupons/:id', authMiddleware, adminMiddleware, httpService.updateAPI.bind(httpService));
  router.delete('/coupons/:id', authMiddleware, adminMiddleware, httpService.deleteAPI.bind(httpService));

  // User route: validate/apply coupon
  router.post('/coupons/validate', authMiddleware, httpService.validateAPI.bind(httpService));

  return { router, repository, validateQueryHandler };
};
