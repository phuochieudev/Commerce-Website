import { PagingDTO } from "../../../share/model/paging";
import { Brand } from "../model/brand";
import { BrandCondDTO, BrandCreateDTO, BrandUpdateDTO } from "../model/dto";

export interface IBrandUsecase {
   create(data: BrandCreateDTO): Promise<string>;
   get(id: string): Promise<Brand | null>;
   list(cond: BrandCondDTO, paging: PagingDTO): Promise<Array<Brand>>;
   update(id: string, data: BrandUpdateDTO): Promise<boolean>;
   delete(id: string): Promise<boolean>;
 }