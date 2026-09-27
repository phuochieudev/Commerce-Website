import { Router } from 'express';
import { Sequelize } from 'sequelize';
import { init, modelName } from './infras/repository/sequelize/dto';
import { MYSQLUserRepository } from './infras/repository/sequelize';
import { RegisterCmdHandler } from './usecase/register';
import { LoginCmdHandler } from './usecase/login';
import { GetProfileQueryHandler } from './usecase/get-profile';
import { UpdateProfileCmdHandler } from './usecase/update-profile';
import { ChangePasswordCmdHandler } from './usecase/change-password';
import { UserHttpService } from './infras/transport';
import { authMiddleware } from '../../share/middleware/authentication';

export const setupUserHexagon = (sequelize: Sequelize) => {
  init(sequelize);

  const repository = new MYSQLUserRepository(sequelize, modelName);
  const registerHandler = new RegisterCmdHandler(repository);
  const loginHandler = new LoginCmdHandler(repository);
  const getProfileHandler = new GetProfileQueryHandler(repository);
  const updateProfileHandler = new UpdateProfileCmdHandler(repository);
  const changePasswordHandler = new ChangePasswordCmdHandler(repository);

  const httpService = new UserHttpService(
    registerHandler,
    loginHandler,
    getProfileHandler,
    updateProfileHandler,
    changePasswordHandler
  );

  const router = Router();

  router.post('/auth/register', httpService.registerAPI.bind(httpService));
  router.post('/auth/login', httpService.loginAPI.bind(httpService));
  router.get('/profile', authMiddleware, httpService.getProfileAPI.bind(httpService));
  router.patch('/profile', authMiddleware, httpService.updateProfileAPI.bind(httpService));
  router.post('/profile/change-password', authMiddleware, httpService.changePasswordAPI.bind(httpService));

  return router;
};
