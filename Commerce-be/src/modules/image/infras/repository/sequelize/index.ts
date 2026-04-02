import { Sequelize } from 'sequelize';
import { IImageRepository } from '../../../interface';
import { Image } from '../../../model/image';
import { UpdateImageDTO, ImageCondDTO } from '../../../model/dto';
import { PagingDTO } from '../../../../../share/model/paging';

export class MYSQLImageRepository implements IImageRepository {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly modelName: string
  ) {}

  async get(id: string): Promise<Image | null> {
    const data = await this.sequelize.models[this.modelName].findByPk(id);
    if (!data) return null;
    return data.get({ plain: true }) as Image;
  }

  async list(cond: ImageCondDTO, paging: PagingDTO): Promise<Image[]> {
    const { page, limit } = paging;
    const rows = await this.sequelize.models[this.modelName].findAll({
      where: cond as any,
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']],
    });
    return rows.map((row) => row.get({ plain: true }) as Image);
  }

  async count(cond: ImageCondDTO): Promise<number> {
    return await this.sequelize.models[this.modelName].count({ where: cond as any });
  }

  async insert(data: Image): Promise<boolean> {
    await this.sequelize.models[this.modelName].create(data as any);
    return true;
  }

  async update(id: string, data: UpdateImageDTO): Promise<boolean> {
    await this.sequelize.models[this.modelName].update(data as any, { where: { id } });
    return true;
  }

  async delete(id: string): Promise<boolean> {
    await this.sequelize.models[this.modelName].destroy({ where: { id } });
    return true;
  }
}
