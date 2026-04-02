import { Sequelize } from 'sequelize';
import { Router } from 'express';
import { init, modelName } from './infras/repository/sequelize/dto';
import { MYSQLProductVariantRepository } from './infras/repository/sequelize';
import { ProductVariantHttpService } from './infras/transport';
import { CreateVariantCmdHandler } from './usecase/create-variant';
import { GetVariantDetailQueryHandler } from './usecase/get-variant-detail';
import { UpdateVariantCmdHandler } from './usecase/update-variant';
import { DeleteVariantCmdHandler } from './usecase/delete-variant';
import { ListVariantsQueryHandler } from './usecase/list-variants';
import { authMiddleware, adminMiddleware } from '../../share/middleware/authentication';

export const setupProductVariantHexagon = (sequelize: Sequelize) => {
  init(sequelize);

  const repository = new MYSQLProductVariantRepository(sequelize, modelName);

  const createCmdHandler = new CreateVariantCmdHandler(repository);
  const getDetailQueryHandler = new GetVariantDetailQueryHandler(repository);
  const updateCmdHandler = new UpdateVariantCmdHandler(repository);
  const deleteCmdHandler = new DeleteVariantCmdHandler(repository);
  const listQueryHandler = new ListVariantsQueryHandler(repository);

  const httpService = new ProductVariantHttpService(
    createCmdHandler,
    getDetailQueryHandler,
    updateCmdHandler,
    deleteCmdHandler,
    listQueryHandler
  );

  const router = Router();

  // Public: list variants for a product / get variant detail
  router.get('/products/:productId/variants', httpService.listAPI.bind(httpService));
  router.get('/products/:productId/variants/:variantId', httpService.getDetailAPI.bind(httpService));

  // Admin only: manage variants
  router.post('/products/:productId/variants', authMiddleware, adminMiddleware, httpService.createAPI.bind(httpService));
  router.patch('/products/:productId/variants/:variantId', authMiddleware, adminMiddleware, httpService.updateAPI.bind(httpService));
  router.delete('/products/:productId/variants/:variantId', authMiddleware, adminMiddleware, httpService.deleteAPI.bind(httpService));

  return router;
};
