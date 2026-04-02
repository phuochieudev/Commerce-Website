import { PagingDTO } from '../../../share/model/paging';
import { ProductVariant } from '../model/product-variant';
import { ProductVariantCondDTO, ProductVariantCreateDTO, ProductVariantUpdateDTO } from '../model/dto';

export interface IProductVariantRepository {
  get(id: string): Promise<ProductVariant | null>;
  findBySku(sku: string): Promise<ProductVariant | null>;
  list(cond: ProductVariantCondDTO, paging: PagingDTO): Promise<ProductVariant[]>;
  count(cond: ProductVariantCondDTO): Promise<number>;
  insert(data: ProductVariant): Promise<boolean>;
  update(id: string, data: ProductVariantUpdateDTO): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

export interface CreateVariantCommand {
  productId: string;
  dto: ProductVariantCreateDTO;
}

export interface UpdateVariantCommand {
  id: string;
  dto: ProductVariantUpdateDTO;
}

export interface DeleteVariantCommand {
  id: string;
}

export interface GetVariantDetailQuery {
  id: string;
}

export interface ListVariantsQuery {
  cond: ProductVariantCondDTO;
  paging: PagingDTO;
}
