import { IQueryHandler, IQueryRepository } from "../../../share/interface";
import { ErrDataNotFound } from "../../../share/model/base-errors";
import { getDetailQuery} from "../interface";
import { Brand } from "../model/brand";
import { BrandCondDTO } from "../model/dto";

export class GetBrandDetailQuery implements IQueryHandler<getDetailQuery, Brand> {

    constructor(private readonly repository: IQueryRepository<Brand, BrandCondDTO>) {}

    async query(query: getDetailQuery): Promise<Brand> {
       const data = await this.repository.get(query.id);

       if(!data) {
            throw ErrDataNotFound;
        }
        
        return data;
    }
}