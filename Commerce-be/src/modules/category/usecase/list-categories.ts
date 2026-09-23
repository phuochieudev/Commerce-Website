import { IQueryHandler, IQueryRepository } from "../../../share/interface";
import { ListQuery } from "../interface";
import { Category } from "../model/category";
import { CategoryCondDTO } from "../model/dto";

export class ListCategoriesQuery implements IQueryHandler<ListQuery, Category[]> {

    constructor(private readonly repository: IQueryRepository<Category, CategoryCondDTO>) {}

    async query(query: ListQuery): Promise<Category[]> {
    const collection = await this.repository.list(query.cond, query.paging);
    return collection;
    }
}
