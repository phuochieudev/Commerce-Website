import { ICategoryUsecase } from "../../interface";
import { CategoryCondDTOSchema, CategoryCreateSchema, CategoryUpdateSchema } from "../../model/dto";
import { PagingDTOSchema } from "../../../../share/model/paging";
import { CategoryUseCase } from "../../usecase";
import {Request, Response} from "express";

export class CategoryHttpService {
    constructor(private readonly useCase: ICategoryUsecase) {}

    async createANewCategoryAPI(req: Request, res: Response) {
        const {success, data, error} =  CategoryCreateSchema.safeParse(req.body);
        
            if(!success){
              res.status(400).json({
              message: error.message,
              });
              return;
            }

       const result = await this.useCase.createANewCategory(data);
       res.status(201).json({ data: result });
    }

    async getDetailCategoryAPI(req: Request, res: Response) {
      const { id } = req.params;

      const result = await this.useCase.getDetailCategory(id);
      res.status(200).json({ data: result });
    }

    async updateCategoryAPI(req: Request, res: Response) {
      const { id } = req.params;
      const { success, data, error } = CategoryUpdateSchema.safeParse(req.body);

      if (!success) {
        res.status(400).json({
          message: error.message,
        });
        return;
      }

      const result = await this.useCase.updateCategory(id, data);
      res.status(200).json({ data: result });
    }

    async deleteCategoryAPI(req: Request, res: Response) {
      const { id } = req.params;

      const result = await this.useCase.deleteCategory(id);
      res.status(200).json({ data: result });
    }

    async listCategoriesAPI(req: Request, res: Response) {
      const {success, data: pagging, error} = PagingDTOSchema.safeParse(req.query);
      if (!success) {
        res.status(400).json({
          message: 'Invalid pagging',
          error: error.message
        });
        return;
      } 

      const cond = CategoryCondDTOSchema.parse(req.query);

      const result = await this.useCase.listCategories(cond, pagging);
      res.status(200).json({data: result, pagging, filter: cond});
    }
}