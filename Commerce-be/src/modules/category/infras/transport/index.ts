import { CreateCommand, DeleteCommand, getDetailQuery, ListQuery, UpdateCommand } from "../../interface";
import { CategoryCondDTOSchema, CategoryCreateSchema, CategoryUpdateSchema } from "../../model/dto";
import {Request, Response} from "express";
import { Category } from "../../model/category";
import { ICommandHandler, IQueryHandler } from "../../../../share/interface";

export class CategoryHttpService {
    constructor(
      private readonly createCommandHandler: ICommandHandler<CreateCommand, string>,
      private readonly getDetailQueryHandler: IQueryHandler<getDetailQuery, Category>,
      private readonly updateCmdHandler: ICommandHandler<UpdateCommand, boolean>,
      private readonly deleteCmdHandler: ICommandHandler<DeleteCommand, boolean>,
      private readonly listQueryHandler: IQueryHandler<ListQuery, Category[]>
    ) {}

    async createANewCategoryAPI(req: Request, res: Response) {
        const {success, data, error} =  CategoryCreateSchema.safeParse(req.body);
            if(!success){
              res.status(400).json({
              message: error.message,
              });
              return;
            }

       const result = await this.createCommandHandler.execute({ dto: data });
       res.status(201).json({ data: result });
    }

    async getDetailCategoryAPI(req: Request, res: Response) {
      const { id } = req.params;
      const result = await this.getDetailQueryHandler.query({ id });
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

      const result = await this.updateCmdHandler.execute({ id, dto: data });
      res.status(200).json({ data: result });
    }

    async deleteCategoryAPI(req: Request, res: Response) {
      const { id } = req.params;
      const result = await this.deleteCmdHandler.execute({ id, isHardDelete: false });
      res.status(200).json({ data: result });
    }

    async listCategoriesAPI(req: Request, res: Response) {
      const pagging = {
        page: 1,
        limit: 10,
      };

      const cond = CategoryCondDTOSchema.parse(req.query);
      const result = await this.listQueryHandler.query({ cond, paging: pagging });
      const categoriesTree = this.buildTree(result);
      res.status(200).json({data: categoriesTree, pagging, filter: cond});
    }

    // Build category tree from flat array
    private buildTree(categories : Category[]): Category[] {
      const categoriesTree: Category[] = [];
      const mapChildren = new Map<string, Category[]>();

      for(let i =0; i<categories.length; i++) {
       const category = categories[i];
        if(!mapChildren.get(category.id)){
          mapChildren.set(category.id, []);
        }
        category.children = mapChildren.get(category.id)!;

        if(!category.parentId){
          categoriesTree.push(category);
        }else{
          const children = mapChildren.get(category.parentId);
          children ? children.push(category) : mapChildren.set(category.parentId, [category]);
        }
      }

      return categoriesTree;
    }
}
