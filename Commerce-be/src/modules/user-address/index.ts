import { Sequelize } from 'sequelize';
import { Router } from 'express';
import { init, modelName } from './infras/repository/sequelize/dto';
import { MYSQLUserAddressRepository } from './infras/repository/sequelize';
import { UserAddressHttpService } from './infras/transport';
import { CreateAddressCmdHandler } from './usecase/create-address';
import { UpdateAddressCmdHandler } from './usecase/update-address';
import { DeleteAddressCmdHandler } from './usecase/delete-address';
import { SetDefaultAddressCmdHandler } from './usecase/set-default-address';
import { ListAddressesQueryHandler } from './usecase/list-addresses';
import { authMiddleware } from '../../share/middleware/authentication';

export const setupUserAddressHexagon = (sequelize: Sequelize) => {
  init(sequelize);

  const repository = new MYSQLUserAddressRepository(sequelize, modelName);

  const createCmdHandler = new CreateAddressCmdHandler(repository);
  const updateCmdHandler = new UpdateAddressCmdHandler(repository);
  const deleteCmdHandler = new DeleteAddressCmdHandler(repository);
  const setDefaultCmdHandler = new SetDefaultAddressCmdHandler(repository);
  const listQueryHandler = new ListAddressesQueryHandler(repository);

  const httpService = new UserAddressHttpService(
    createCmdHandler,
    updateCmdHandler,
    deleteCmdHandler,
    setDefaultCmdHandler,
    listQueryHandler
  );

  const router = Router();

  // All routes require auth (user's own addresses)
  router.post('/addresses', authMiddleware, httpService.createAPI.bind(httpService));
  router.get('/addresses', authMiddleware, httpService.listAPI.bind(httpService));
  router.patch('/addresses/:id', authMiddleware, httpService.updateAPI.bind(httpService));
  router.delete('/addresses/:id', authMiddleware, httpService.deleteAPI.bind(httpService));
  router.patch('/addresses/:id/default', authMiddleware, httpService.setDefaultAPI.bind(httpService));

  return router;
};
