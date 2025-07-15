import { v7 } from "uuid";
import { IRepository } from "../../../share/interface";
import { PagingDTO } from "../../../share/model/paging";
import { IBrandUsecase } from "../interface";
import { Brand } from "../model/brand";
import { BrandCondDTO, BrandCreateDTO, BrandCreateDTOSchema, BrandUpdateDTO } from "../model/dto";
import { Model } from "sequelize";
import { ModelStatus } from "../../../share/model/base-model";

export class BrandUseCase implements IBrandUsecase {
  constructor(private readonly repository: IRepository<Brand, BrandCondDTO, BrandUpdateDTO>) {}

    async create(data: BrandCreateDTO): Promise<string> {
      const {success, data: parsedData, error} = BrandCreateDTOSchema.safeParse(data);

      if (!success) {
        throw new Error(`Invalid data:`);
      }

      const newId = v7();

      const newBrand = {
        ...parsedData,
        id: newId,
        name: parsedData.name as string,
        status: ModelStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.repository.insert(newBrand);
    
      return newId;
    }

    get(id: string): Promise<Brand | null> {
        throw new Error("Method not implemented.");
    }

    list(cond: BrandCondDTO, paging: PagingDTO): Promise<Array<Brand>> {
        throw new Error("Method not implemented.");
    }

    update(id: string, data: BrandUpdateDTO): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
  
}
 