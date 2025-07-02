import { Router } from "express";

import { init, modelName } from "./infras/repository/dto";
import { Sequelize } from "sequelize";
import { CategoryUseCase } from "./usecase";
import { MYSQLCategoryRepository } from "./infras/repository/repo";
import { CategoryHttpService } from "./infras/transport/http-service";

export const setupCategoryHexagon = (sequelize : Sequelize) => {
    init(sequelize);

    const repository = new MYSQLCategoryRepository(sequelize, modelName);
    const useCase = new CategoryUseCase(repository);
    const httpService = new CategoryHttpService(useCase);
    
    const router = Router();

    router.post('/categories', httpService.createANewCategoryAPI.bind(httpService));
    router.get('/categories/:id', httpService.getDetailCategoryAPI.bind(httpService));
    router.get('/categories', httpService.listCategoriesAPI.bind(httpService));
    router.patch('/categories/:id', httpService.updateCategoryAPI.bind(httpService));
    router.delete('/categories/:id', httpService.deleteCategoryAPI.bind(httpService));
    return router;
}