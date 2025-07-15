import { Sequelize } from "sequelize";
import { BaseRepositorySequelize } from "../../../../../share/repository/repo-sequelize";
import { Brand, modelName } from "../../../model/brand";
import { BrandCondDTO, BrandUpdateDTO } from "../../../model/dto";

export class MYSQLBrandRepository extends BaseRepositorySequelize<Brand, BrandCondDTO, BrandUpdateDTO> {
    constructor(sequelize: Sequelize) {
        super(sequelize, modelName);
        
    }
}