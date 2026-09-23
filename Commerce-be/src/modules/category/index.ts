import { Router } from "express";
import { init, modelName } from "./infras/repository/sequelize/dto";
import { Sequelize } from "sequelize";
import { MYSQLCategoryRepository } from "./infras/repository/sequelize";
import { CategoryHttpService } from "./infras/transport";
import { CreateNewCategoryCmdHandler } from "./usecase/create-new-category";
import { GetCategoryDetailQuery } from "./usecase/get-category-detail";
import { UpdateCategoryCmdHandler } from "./usecase/update-category";
import { DeleteCategoryCmdHandler } from "./usecase/delete-category";
import { ListCategoriesQuery } from "./usecase/list-categories";

export const setupCategoryHexagon = (sequelize: Sequelize) => {
  init(sequelize);

  const repository = new MYSQLCategoryRepository(sequelize, modelName);
  const createCommandHandler = new CreateNewCategoryCmdHandler(repository);
  const getDetailQueryHandler = new GetCategoryDetailQuery(repository);
  const updateCmdHandler = new UpdateCategoryCmdHandler(repository);
  const deleteCmdHandler = new DeleteCategoryCmdHandler(repository);
  const listQueryHandler = new ListCategoriesQuery(repository);

  const httpService = new CategoryHttpService(
    createCommandHandler,
    getDetailQueryHandler,
    updateCmdHandler,
    deleteCmdHandler,
    listQueryHandler
  );

  const router = Router();

  router.post(
    "/categories",
    httpService.createANewCategoryAPI.bind(httpService)
  );

  router.get(
    "/categories/:id",
    httpService.getDetailCategoryAPI.bind(httpService)
  );

  router.get("/categories", httpService.listCategoriesAPI.bind(httpService));

  router.patch(
    "/categories/:id",
    httpService.updateCategoryAPI.bind(httpService)
  );

  router.delete(
    "/categories/:id",
    httpService.deleteCategoryAPI.bind(httpService)
  );
  return router;
};
