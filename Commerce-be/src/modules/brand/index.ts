import { Sequelize } from "sequelize";
import { init } from "./infras/repository/sequelize/dto";
import { MYSQLBrandRepository } from "./infras/repository/sequelize";
import { BrandHttpService } from "./infras/transport";
import { Router } from "express";
import { CreateNewBrandCmdHandler } from "./usecase/create-new-brand";
import { GetBrandDetailQuery } from "./usecase/get-brand-detail";
import { UpdateBrandCmdHandler } from "./usecase/update-brand";
import { DeleteBrandCmdHandler } from "./usecase/delete-brand";
import { ListBrandQuery } from "./usecase/list-brand";
import { modelName } from "./model/brand";
import { authMiddleware, adminMiddleware } from "../../share/middleware/authentication";

export const setupBrandHexagon = (sequelize: Sequelize) => {
  init(sequelize);

  const repository = new MYSQLBrandRepository(sequelize, modelName);
  const createCommandHandler = new CreateNewBrandCmdHandler(repository);
  const getDetailQueryHandler = new GetBrandDetailQuery(repository);
  const updateCmdHandler = new UpdateBrandCmdHandler(repository);
  const deleteCmdHandler = new DeleteBrandCmdHandler(repository);
  const listQueryHandler = new ListBrandQuery(repository);

  const httpService = new BrandHttpService(
    createCommandHandler,
    getDetailQueryHandler,
    updateCmdHandler,
    deleteCmdHandler,
    listQueryHandler
  );

  const router = Router();

  router.post("/brands", authMiddleware, adminMiddleware, httpService.createAPI.bind(httpService));
  router.get("/brands/:id", httpService.getDetailAPI.bind(httpService));
  router.get("/brands", httpService.listsAPI.bind(httpService));
  router.patch("/brands/:id", authMiddleware, adminMiddleware, httpService.updateAPI.bind(httpService));
  router.delete("/brands/:id", authMiddleware, adminMiddleware, httpService.deleteAPI.bind(httpService));

  return router;
};
