import { PagingDTO } from "../model/paging";

export interface IRepository<Entity, Cond, UpdateDTO> extends IQueryRepository<Entity, Cond>, ICommandRepository<Entity, UpdateDTO> { }

 export interface IQueryRepository<Entity, Cond> {
    get(id: string): Promise<Entity | null>;
    list(cond: Cond ,paging: PagingDTO): Promise<Array<Entity>>;
 }

 export interface ICommandRepository<Entity, UpdateDTO> {
    insert(data: Entity): Promise<boolean>;
    update(id: string, data: UpdateDTO): Promise<boolean>;
    delete(id: string, isHard: boolean): Promise<boolean>;
 }
