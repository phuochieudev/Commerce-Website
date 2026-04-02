import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { init, modelName } from './infras/repository/sequelize/dto';
import { MYSQLImageRepository } from './infras/repository/sequelize';
import { CreateImageCmdHandler } from './usecase/create-image';
import { DeleteImageCmdHandler } from './usecase/delete-image';
import { ListImagesQueryHandler } from './usecase/list-images';
import { ImageHttpService } from './infras/transport';
import { authMiddleware, adminMiddleware } from '../../share/middleware/authentication';

export const setupImageHexagon = (sequelize: Sequelize) => {
  init(sequelize);

  const repository = new MYSQLImageRepository(sequelize, modelName);
  const createHandler = new CreateImageCmdHandler(repository);
  const deleteHandler = new DeleteImageCmdHandler(repository);
  const listHandler = new ListImagesQueryHandler(repository);

  const httpService = new ImageHttpService(createHandler, deleteHandler, listHandler);

  const router = Router();

  router.post('/images', authMiddleware, adminMiddleware, httpService.createAPI.bind(httpService));
  router.get('/images', authMiddleware, adminMiddleware, httpService.listAPI.bind(httpService));
  router.delete('/images/:id', authMiddleware, adminMiddleware, httpService.deleteAPI.bind(httpService));

  return router;
};
