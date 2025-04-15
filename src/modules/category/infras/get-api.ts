import { Request, Response } from 'express';
import { CategoryPersistence } from './repository/dto';
import { CategoryStatus } from '../model/model';

export const getCategoryApi = async (req: Request, res: Response) => {

  const { id } = req.params;

  const category = await CategoryPersistence.findByPk(id);

  if (!category || category.status === CategoryStatus.Deleted) {
    res.status(404).json({
      message: 'Category not found',
    });
    return;
  }
    res.status(200).json({
      data: category,
    });
}