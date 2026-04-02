import { Op, Sequelize } from "sequelize";
import { BaseRepositorySequelize, BaseQueryRepositorySequelize, BaseCommandRepositorySequelize } from "../../../../../share/repository/repo-sequelize";
import { Brand } from "../../../model/brand";
import { BrandCondDTO, BrandUpdateDTO } from "../../../model/dto";

export class MYSQLBrandRepository extends BaseRepositorySequelize<Brand, BrandCondDTO, BrandUpdateDTO> {
    constructor(readonly sequelize: Sequelize, readonly modelName: string){
        super(
            new MYSQLBrandQueryRepository(sequelize, modelName),
            new MYSQLBrandCommandRepository(sequelize, modelName),
        );
    }       
}

export class MYSQLBrandQueryRepository extends BaseQueryRepositorySequelize<Brand, BrandCondDTO> {
    constructor( readonly sequelize: Sequelize, readonly modelName: string){
        super(
            sequelize,
            modelName
        );
    }
}

export class MYSQLBrandCommandRepository extends BaseCommandRepositorySequelize<Brand, BrandUpdateDTO> {
    constructor( readonly sequelize: Sequelize, readonly modelName: string){
        super(
            sequelize,
            modelName
        );
    }

    get(id: string): Promise<Brand> {
        // Implement the logic to retrieve a Brand by ID
        throw new Error("Method not implemented.");
    }

    findByCond(cond: BrandCondDTO): Promise<Brand | null> {
        // Implement the logic to find a Brand by condition
        throw new Error("Method not implemented.");
    }

    list(cond: BrandCondDTO): Promise<Brand[]> {
        // Implement the logic to list Brands by condition
        throw new Error("Method not implemented.");
    }
}