import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { init, modelName } from './infras/repository/sequelize/dto';
import { MYSQLCartRepository } from './infras/repository/sequelize';
import { AddToCartCmdHandler } from './usecase/add-to-cart';
import { UpdateCartCmdHandler } from './usecase/update-cart';
import { RemoveCartItemCmdHandler } from './usecase/remove-cart-item';
import { ListCartQueryHandler } from './usecase/list-cart';
import { CartHttpService } from './infras/transport';
import { authMiddleware } from '../../share/middleware/authentication';
import { IQueryRepository } from '../../share/interface';

export const setupCartHexagon = (sequelize: Sequelize, productRepository?: IQueryRepository<any, any>) => {
  init(sequelize);

  const repository = new MYSQLCartRepository(sequelize, modelName);
  const addToCartHandler = new AddToCartCmdHandler(repository);
  const updateCartHandler = new UpdateCartCmdHandler(repository);
  const removeCartItemHandler = new RemoveCartItemCmdHandler(repository);
  const listCartHandler = new ListCartQueryHandler(repository, productRepository);

  const httpService = new CartHttpService(
    addToCartHandler,
    updateCartHandler,
    removeCartItemHandler,
    listCartHandler
  );

  const router = Router();

  router.post('/cart', authMiddleware, httpService.addToCartAPI.bind(httpService));
  router.get('/cart', authMiddleware, httpService.listCartAPI.bind(httpService));
  router.patch('/cart/:id', authMiddleware, httpService.updateCartAPI.bind(httpService));
  router.delete('/cart/:id', authMiddleware, httpService.removeCartItemAPI.bind(httpService));

  return router;
};
