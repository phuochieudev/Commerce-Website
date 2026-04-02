import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { init, orderModelName, orderItemModelName } from './infras/repository/sequelize/dto';
import { MYSQLOrderRepository } from './infras/repository/sequelize';
import { CreateOrderCmdHandler } from './usecase/create-order';
import { GetOrderDetailQueryHandler } from './usecase/get-order-detail';
import { ListOrdersQueryHandler } from './usecase/list-orders';
import { UpdateOrderStatusCmdHandler } from './usecase/update-order-status';
import { CancelOrderCmdHandler } from './usecase/cancel-order';
import { OrderHttpService } from './infras/transport';
import { IProductQueryForOrder, ICouponServiceForOrder } from './interface';
import { authMiddleware, adminMiddleware } from '../../share/middleware/authentication';

export const setupOrderHexagon = (sequelize: Sequelize, productQueryService: IProductQueryForOrder, couponService?: ICouponServiceForOrder) => {
  init(sequelize);

  const orderRepository = new MYSQLOrderRepository(sequelize, orderModelName, orderItemModelName);
  const createHandler = new CreateOrderCmdHandler(orderRepository, productQueryService, couponService);
  const getDetailHandler = new GetOrderDetailQueryHandler(orderRepository);
  const listHandler = new ListOrdersQueryHandler(orderRepository);
  const updateStatusHandler = new UpdateOrderStatusCmdHandler(orderRepository);
  const cancelHandler = new CancelOrderCmdHandler(orderRepository);

  const httpService = new OrderHttpService(
    createHandler,
    getDetailHandler,
    listHandler,
    updateStatusHandler,
    cancelHandler
  );

  const router = Router();

  router.post('/orders', authMiddleware, httpService.createAPI.bind(httpService));
  router.get('/orders', authMiddleware, httpService.listAPI.bind(httpService));
  router.get('/orders/:id', authMiddleware, httpService.getDetailAPI.bind(httpService));
  router.patch('/orders/:id/status', authMiddleware, adminMiddleware, httpService.updateStatusAPI.bind(httpService));
  router.patch('/orders/:id/cancel', authMiddleware, httpService.cancelAPI.bind(httpService));

  return router;
};
