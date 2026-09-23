import { ICategoryRepository, UpdateCommand } from "../interface";
import { ModelStatus } from "../../../share/model/base-model";
import { ICommandHandler } from "../../../share/interface";
import { ErrDataNotFound } from "../../../share/model/base-errors";

export class UpdateCategoryCmdHandler implements ICommandHandler<UpdateCommand, boolean> {
    constructor(private readonly repository: ICategoryRepository) {}

    async execute(command: UpdateCommand): Promise<boolean> {
      const category = await this.repository.get(command.id);

      if (!category || category.status === ModelStatus.DELETED) {
        throw ErrDataNotFound;
      }

      return await this.repository.update(command.id, command.dto);
    }
}
