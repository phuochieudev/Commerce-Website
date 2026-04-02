import { IRepository } from '../../../share/interface';
import { PagingDTO } from '../../../share/model/paging';
import { Product } from '../model/product';
import { ProductCondDTO, ProductCreateDTO, ProductUpdateDTO } from '../model/dto';

export interface IProductRepository extends IRepository<Product, ProductCondDTO, ProductUpdateDTO> {}

export interface CreateProductCommand {
  dto: ProductCreateDTO;
}

export interface GetProductDetailQuery {
  id: string;
}

export interface UpdateProductCommand {
  id: string;
  dto: ProductUpdateDTO;
}

export interface DeleteProductCommand {
  id: string;
  isHardDelete: boolean;
}

export interface ListProductQuery {
  cond: ProductCondDTO;
  paging: PagingDTO;
}
