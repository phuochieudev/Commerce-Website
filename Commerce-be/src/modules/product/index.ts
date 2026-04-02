import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { init, modelName } from './infras/repository/sequelize/dto';
import { MYSQLProductRepository } from './infras/repository/sequelize';
import { CreateProductCmdHandler } from './usecase/create-product';
import { GetProductDetailQueryHandler } from './usecase/get-product-detail';
import { ListProductQueryHandler } from './usecase/list-product';
import { UpdateProductCmdHandler } from './usecase/update-product';
import { DeleteProductCmdHandler } from './usecase/delete-product';
import { ProductHttpService } from './infras/transport';
import { authMiddleware, adminMiddleware } from '../../share/middleware/authentication';

export const setupProductHexagon = (sequelize: Sequelize) => {
  init(sequelize);

  const repository = new MYSQLProductRepository(sequelize, modelName);
  const createHandler = new CreateProductCmdHandler(repository);
  const getDetailHandler = new GetProductDetailQueryHandler(repository);
  const listHandler = new ListProductQueryHandler(repository);
  const updateHandler = new UpdateProductCmdHandler(repository);
  const deleteHandler = new DeleteProductCmdHandler(repository);

  const httpService = new ProductHttpService(
    createHandler,
    getDetailHandler,
    updateHandler,
    deleteHandler,
    listHandler
  );

  const router = Router();

  router.get('/products', httpService.listAPI.bind(httpService));
  router.get('/products/:id', httpService.getDetailAPI.bind(httpService));
  router.post('/products', authMiddleware, adminMiddleware, httpService.createAPI.bind(httpService));
  router.patch('/products/:id', authMiddleware, adminMiddleware, httpService.updateAPI.bind(httpService));
  router.delete('/products/:id', authMiddleware, adminMiddleware, httpService.deleteAPI.bind(httpService));

  return router;
};
