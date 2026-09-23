import { DeleteCommand, ICategoryRepository } from "../interface";
import { ModelStatus } from "../../../share/model/base-model";
import { ICommandHandler } from "../../../share/interface";
import { ErrDataNotFound } from "../../../share/model/base-errors";

export class DeleteCategoryCmdHandler implements ICommandHandler<DeleteCommand, boolean> {

  constructor(private readonly repository: ICategoryRepository) {}

  async execute(command: DeleteCommand): Promise<boolean> {
    const category = await this.repository.get(command.id);

    if (!category || category.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }

    return await this.repository.delete(command.id, command.isHardDelete);
  }
}
