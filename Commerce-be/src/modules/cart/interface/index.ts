import { PagingDTO } from '../../../share/model/paging';
import { Cart } from '../model/cart';
import { AddToCartDTO, UpdateCartDTO } from '../model/dto';

export interface ICartRepository {
  findById(id: string): Promise<Cart | null>;
  findByUserProductAttribute(userId: string, productId: string, attribute: string): Promise<Cart | null>;
  listByUserId(userId: string, paging: PagingDTO): Promise<Cart[]>;
  countByUserId(userId: string): Promise<number>;
  insert(data: Cart): Promise<boolean>;
  update(id: string, data: UpdateCartDTO): Promise<boolean>;
  delete(id: string): Promise<boolean>;
}

export interface AddToCartCommand {
  userId: string;
  dto: AddToCartDTO;
}

export interface UpdateCartCommand {
  userId: string;
  cartItemId: string;
  dto: UpdateCartDTO;
}

export interface RemoveCartItemCommand {
  userId: string;
  cartItemId: string;
}

export interface ListCartQuery {
  userId: string;
  paging: PagingDTO;
}
