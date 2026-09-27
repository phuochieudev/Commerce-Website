import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { init, modelName } from './infras/repository/sequelize/dto';
import { MYSQLProductLikeRepository } from './infras/repository/sequelize';
import { LikeProductCmdHandler } from './usecase/like-product';
import { UnlikeProductCmdHandler } from './usecase/unlike-product';
import { ListLikedProductsQueryHandler } from './usecase/list-liked-products';
import { GetLikeStatusQueryHandler } from './usecase/get-like-status';
import { ProductLikeHttpService } from './infras/transport';
import { authMiddleware } from '../../share/middleware/authentication';

export const setupProductLikeHexagon = (sequelize: Sequelize) => {
  init(sequelize);

  const repository = new MYSQLProductLikeRepository(sequelize, modelName);
  const likeHandler = new LikeProductCmdHandler(repository);
  const unlikeHandler = new UnlikeProductCmdHandler(repository);
  const listHandler = new ListLikedProductsQueryHandler(repository);
  const likeStatusHandler = new GetLikeStatusQueryHandler(repository);

  const httpService = new ProductLikeHttpService(likeHandler, unlikeHandler, listHandler, likeStatusHandler);

  const router = Router();

  router.post('/products/:productId/like', authMiddleware, httpService.likeAPI.bind(httpService));
  router.delete('/products/:productId/like', authMiddleware, httpService.unlikeAPI.bind(httpService));
  router.get('/products/:productId/like-status', authMiddleware, httpService.likeStatusAPI.bind(httpService));
  router.get('/liked-products', authMiddleware, httpService.listAPI.bind(httpService));

  return router;
};
