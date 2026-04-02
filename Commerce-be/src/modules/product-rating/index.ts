import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { init, modelName } from './infras/repository/sequelize/dto';
import { MYSQLProductRatingRepository } from './infras/repository/sequelize';
import { CreateRatingCmdHandler } from './usecase/create-rating';
import { UpdateRatingCmdHandler } from './usecase/update-rating';
import { DeleteRatingCmdHandler } from './usecase/delete-rating';
import { ListRatingsQueryHandler } from './usecase/list-ratings';
import { ProductRatingHttpService } from './infras/transport';
import { authMiddleware } from '../../share/middleware/authentication';

export const setupProductRatingHexagon = (sequelize: Sequelize) => {
  init(sequelize);

  const repository = new MYSQLProductRatingRepository(sequelize, modelName);
  const createHandler = new CreateRatingCmdHandler(repository);
  const updateHandler = new UpdateRatingCmdHandler(repository);
  const deleteHandler = new DeleteRatingCmdHandler(repository);
  const listHandler = new ListRatingsQueryHandler(repository);

  const httpService = new ProductRatingHttpService(createHandler, updateHandler, deleteHandler, listHandler);

  const router = Router();

  router.get('/products/:productId/ratings', httpService.listAPI.bind(httpService));
  router.post('/products/:productId/ratings', authMiddleware, httpService.createAPI.bind(httpService));
  router.patch('/products/:productId/ratings', authMiddleware, httpService.updateAPI.bind(httpService));
  router.delete('/products/:productId/ratings', authMiddleware, httpService.deleteAPI.bind(httpService));

  return router;
};
