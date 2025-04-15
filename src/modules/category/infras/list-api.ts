import { Request, Response } from "express";
import { CategoryPersistence } from "./repository/dto";
import { z } from "zod";
import { CategoryStatus } from "../model/model";
import { Op } from "sequelize";

const PagingDTOSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  total: z.coerce.number().int().min(0).default(0).optional(),
});

type PagingDTO = z.infer<typeof PagingDTOSchema>;

export const listCategoryApi = async (req: Request, res: Response) => {
  const { success, data } = PagingDTOSchema.safeParse(req.query);
  if (!success) {
    res.status(400).json({
      message: 'Invalid query parameters',
    });
    return;
  }
  const { page, limit } = data;
  const cond = {status: {[Op.ne]: CategoryStatus.Deleted}}
  const total = await CategoryPersistence.count({where: cond});
  data.total = total;
  const rows = await CategoryPersistence.findAll({where: cond ,limit, offset: (page - 1) * limit, order: [['id', 'DESC']]});
    
  res.status(200).json({
      data: rows,
      paging: data,
    }); 
  }