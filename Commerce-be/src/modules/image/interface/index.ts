import { PagingDTO } from '../../../share/model/paging';
import { Image } from '../model/image';
import { CreateImageDTO, UpdateImageDTO, ImageCondDTO } from '../model/dto';

export interface IImageRepository {
  get(id: string): Promise<Image | null>;
  list(cond: ImageCondDTO, paging: PagingDTO): Promise<Image[]>;
  count(cond: ImageCondDTO): Promise<number>;
  insert(data: Image): Promise<boolean>;
  update(id: string, data: UpdateImageDTO): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

export interface CreateImageCommand {
  dto: CreateImageDTO;
}

export interface GetImageQuery {
  id: string;
}

export interface ListImagesQuery {
  cond: ImageCondDTO;
  paging: PagingDTO;
}

export interface DeleteImageCommand {
  id: string;
}
