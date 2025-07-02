import { create } from "domain";
import { ICategoryUsecase, IRepository } from "../interface";
import { CategoryCondDTO, CategoryCreateDTO, CategoryUpdateDTO } from "../model/dto";
import { Category } from "../model/model";
import { ModelStatus } from "../../../share/model/base-model";
import { v7 } from "uuid";
import { PagingDTO } from "../../../share/model/paging";
import { ErrDataNotFound } from "../../../share/model/base-errors";

export class CategoryUseCase implements ICategoryUsecase {
    constructor(private readonly repository: IRepository) {}

    async createANewCategory(data: CategoryCreateDTO): Promise<string> {
        const newId = v7();

        const category: Category = {
            id: newId,
            name: data.name,
            position: 0,
            image : data.image,
            description: data.description,
            status : ModelStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        await this.repository.insert(category);
        return newId;
    }

   async  getDetailCategory(id: string): Promise<Category | null> {
        const data = await this.repository.get(id);

        if(!data || data.status === ModelStatus.DELETED) {
            throw  ErrDataNotFound;
        }
        return data;
    }

    async listCategories(cond: CategoryCondDTO, paging: PagingDTO): Promise<Array<Category>> {
        const data = await this.repository.list(cond, paging);
        return data;
    }

    async updateCategory(id: string, data: CategoryUpdateDTO): Promise<boolean> {
        const category = await this.repository.get(id);

        if (!category || category.status === ModelStatus.DELETED) {
            throw ErrDataNotFound;
        }

        return await this.repository.update(id, data);
       
    }
    async deleteCategory(id: string): Promise<boolean> {
        const category = await this.repository.get(id);

        if (!category || category.status === ModelStatus.DELETED) {
            throw ErrDataNotFound;
        }

        return await this.repository.delete(id, false);
    }
}