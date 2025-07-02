import { Category } from "../model/model";
import { PagingDTO } from "../../../share/model/paging";
import { CategoryCondDTO, CategoryCreateDTO, CategoryUpdateDTO } from "../model/dto";
export interface ICategoryUsecase {
   createANewCategory(data: CategoryCreateDTO): Promise<string>;
   getDetailCategory(id: string): Promise<Category | null>;
   listCategories(cond: CategoryCondDTO, paging: PagingDTO): Promise<Array<Category>>;
   updateCategory(id: string, data: CategoryUpdateDTO): Promise<boolean>;
   deleteCategory(id: string): Promise<boolean>;
 }

export interface IRepository extends IQueryRepository, ICommandRepository { }

 export interface IQueryRepository {
    get(id: string): Promise<Category | null>;
    list(cond: CategoryCondDTO ,paging: PagingDTO): Promise<Array<Category>>;
 }

 export interface ICommandRepository {
    insert(data: Category): Promise<boolean>;
    update(id: string, data: CategoryUpdateDTO): Promise<boolean>;
    delete(id: string, isHard: boolean): Promise<boolean>;
 }