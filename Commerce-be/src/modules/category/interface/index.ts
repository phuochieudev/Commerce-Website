import { IRepository } from "../../../share/interface";
import { PagingDTO } from "../../../share/model/paging";
import { Category } from "../model/category";
import { CategoryCondDTO, CategoryCreateDTO, CategoryUpdateDTO } from "../model/dto";

export interface ICategoryUsecase {
   createANewCategory(data: CategoryCreateDTO): Promise<string>;
   getDetailCategory(id: string): Promise<Category | null>;
   listCategories(cond: CategoryCondDTO, paging: PagingDTO): Promise<Array<Category>>;
   updateCategory(id: string, data: CategoryUpdateDTO): Promise<boolean>;
   deleteCategory(id: string): Promise<boolean>;
 }

export interface CreateCommand {
  dto: CategoryCreateDTO;
}

export interface getDetailQuery {
  id: string;
}

export interface UpdateCommand {
  id: string;
  dto: CategoryUpdateDTO;
}

export interface DeleteCommand {
  id: string;
  isHardDelete: boolean;
}

export interface ListQuery {
  cond: CategoryCondDTO;
  paging: PagingDTO;
}

export interface ICategoryRepository extends IRepository<Category, CategoryCondDTO, CategoryUpdateDTO> {}
