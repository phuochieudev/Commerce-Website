import { IQueryHandler } from '../../../share/interface';
import { ListImagesQuery, IImageRepository } from '../interface';
import { Image } from '../model/image';

export class ListImagesQueryHandler implements IQueryHandler<ListImagesQuery, Image[]> {
  constructor(private readonly repository: IImageRepository) {}

  async query(query: ListImagesQuery): Promise<Image[]> {
    const total = await this.repository.count(query.cond);
    query.paging.total = total;
    return await this.repository.list(query.cond, query.paging);
  }
}
