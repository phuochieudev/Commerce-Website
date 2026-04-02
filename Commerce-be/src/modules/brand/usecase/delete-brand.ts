import { DeleteCommand, IBrandRepository} from "../interface";
import { ModelStatus } from "../../../share/model/base-model";
import { ICommandHandler } from "../../../share/interface";
import { ErrDataNotFound } from "../../../share/model/base-errors";

export class DeleteBrandCmdHandler implements ICommandHandler<DeleteCommand, void>{
  
  constructor(private readonly repository: IBrandRepository) {}

  async execute(command: DeleteCommand): Promise<void> {
    const data = await this.repository.get(command.id);

    if (!data || data.status === ModelStatus.DELETED) {
      throw ErrDataNotFound;
    }
    
    await this.repository.delete(command.id, command.isHardDelete);
    return;
  }
}