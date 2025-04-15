import { Request, Response } from "express";
import { CategoryCreateSchema } from "../model/dto";
import { CategoryPersistence } from "./repository/dto";
import { v7 } from "uuid";

export async function createCategoryApi(req: Request, res: Response): Promise<void> {

  const {success, data, error} =  CategoryCreateSchema.safeParse(req.body);

    if(!success){
      res.status(400).json({
      message: error.message,
      });
      return;
    }
    const newId = v7();
    await CategoryPersistence.create({id: newId,...data});

    res.status(200).json({
      data: newId,
    }); 
  }