import { IQueryHandler, IQueryRepository } from "../../../share/interface";
import { ErrDataNotFound } from "../../../share/model/base-errors";
import { ModelStatus } from "../../../share/model/base-model";
import { getDetailQuery } from "../interface";
import { Category } from "../model/category";
import { CategoryCondDTO } from "../model/dto";

export class GetCategoryDetailQuery implements IQueryHandler<getDetailQuery, Category> {

    constructor(private readonly repository: IQueryRepository<Category, CategoryCondDTO>) {}

    async query(query: getDetailQuery): Promise<Category> {
       const data = await this.repository.get(query.id);

       if (!data || data.status === ModelStatus.DELETED) {
            throw ErrDataNotFound;
        }

        return data;
    }
}
