import { v7 } from "uuid";
import { CreateCommand, ICategoryRepository } from "../interface";
import { ErrCategoryNameDuplicate } from "../model/errors";
import { ModelStatus } from "../../../share/model/base-model";
import { ICommandHandler } from "../../../share/interface";

export class CreateNewCategoryCmdHandler implements ICommandHandler<CreateCommand, string> {
    constructor(private readonly repository: ICategoryRepository) {}

    async execute(command: CreateCommand): Promise<string> {
      const isExist = await this.repository.findByCond({ name: command.dto.name });
      if (isExist) {
        throw ErrCategoryNameDuplicate;
      }

      const newId = v7();
      const newCategory = {
        id: newId,
        name: command.dto.name,
        position: 0,
        image: command.dto.image,
        description: command.dto.description,
        parentId: command.dto.parentId,
        status: ModelStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await this.repository.insert(newCategory);
      return newId;
    }
}
