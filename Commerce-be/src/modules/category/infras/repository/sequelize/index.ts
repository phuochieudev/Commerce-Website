import { Sequelize } from "sequelize";
import { BaseRepositorySequelize, BaseQueryRepositorySequelize, BaseCommandRepositorySequelize } from "../../../../../share/repository/repo-sequelize";
import { Category } from "../../../model/category";
import { CategoryCondDTO, CategoryUpdateDTO } from "../../../model/dto";

export class MYSQLCategoryRepository extends BaseRepositorySequelize<Category, CategoryCondDTO, CategoryUpdateDTO> {
    constructor(readonly sequelize: Sequelize, readonly modelName: string){
        super(
            new MYSQLCategoryQueryRepository(sequelize, modelName),
            new MYSQLCategoryCommandRepository(sequelize, modelName),
        );
    }
}

export class MYSQLCategoryQueryRepository extends BaseQueryRepositorySequelize<Category, CategoryCondDTO> {
    constructor( readonly sequelize: Sequelize, readonly modelName: string){
        super(
            sequelize,
            modelName
        );
    }
}

export class MYSQLCategoryCommandRepository extends BaseCommandRepositorySequelize<Category, CategoryUpdateDTO> {
    constructor( readonly sequelize: Sequelize, readonly modelName: string){
        super(
            sequelize,
            modelName
        );
    }

    get(id: string): Promise<Category> {
        // Implement the logic to retrieve a Category by ID
        throw new Error("Method not implemented.");
    }

    findByCond(cond: CategoryCondDTO): Promise<Category | null> {
        // Implement the logic to find a Category by condition
        throw new Error("Method not implemented.");
    }

    list(cond: CategoryCondDTO): Promise<Category[]> {
        // Implement the logic to list Categories by condition
        throw new Error("Method not implemented.");
    }
}
