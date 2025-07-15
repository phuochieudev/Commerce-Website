import { Sequelize } from "sequelize";
import { IRepository } from "../interface";
import { PagingDTO } from "../model/paging";
import { Op } from "sequelize";
import { ModelStatus } from "../model/base-model";

export abstract class BaseRepositorySequelize< Entity, Cond, UpdateDTO> implements IRepository<Entity, Cond, UpdateDTO> {
    constructor(private readonly sequelize: Sequelize, private readonly modelName: string){}

    async get(id: string): Promise<Entity | null> {
        const data = await this.sequelize.models[this.modelName].findByPk(id);
        if(!data){
            return null;
        }
        const persistenceData = data.get({plain: true});
        return{
            ...persistenceData,
            children: [],
            createdAt: persistenceData.created_at,
            updatedAt: persistenceData.updated_at,
        }  as Entity;
    }

    async list(cond: Cond, paging: PagingDTO): Promise<Array<Entity>> {
        const { page, limit } = paging;

        const condSQL = {...cond,status: {[Op.ne]: ModelStatus.DELETED}}

        const total = await this.sequelize.models[this.modelName].count({where: condSQL});
        paging.total = total;

        const rows = await this.sequelize.models[this.modelName].findAll({where: condSQL ,limit, offset: (page - 1) * limit, order: [['id', 'DESC']]});

        return rows.map((row) => row.get({plain: true}));
    }   

    async insert(data: Entity): Promise<boolean> {
        await this.sequelize.models[this.modelName].create(data as any);
        return true;
    }

    async update(id: string, data: UpdateDTO): Promise<boolean> {
        await this.sequelize.models[this.modelName].update(data as any, {where: {id}});
        return true;   
    }

    async delete(id: string, isHard: boolean = false): Promise<boolean> {
        if(!isHard) {
            await this.sequelize.models[this.modelName].update( {status: ModelStatus.DELETED},{where: {id}});
        }else {
            await this.sequelize.models[this.modelName].destroy({where: {id}});
        }
        return true;
}
}