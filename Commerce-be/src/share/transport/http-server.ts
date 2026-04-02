import { Request, Response } from "express";
import { IUseCase } from "../interface";
import {PagingDTOSchema } from "../model/paging";
import { filter } from "lodash";

export abstract class BaseHTTPServer<Entity, CreateDTO, UpdateDTO, Cond> {

    constructor(readonly useCase: IUseCase<Entity, CreateDTO, UpdateDTO, Cond>) {}

    async createAPI(req: Request<any, any, CreateDTO>, res: Response) {
        try {
            const result = await this.useCase.create(req.body);
            res.status(201).json({ data: result });
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }

    async getDetailAPI(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const result = await this.useCase.getDetail(id);
            res.status(200).json({ data: result });
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }

    async updateAPI(req: Request<any, any, UpdateDTO>, res: Response) {
        try {
            const { id } = req.params;
            const result = await this.useCase.update(id, req.body);
            res.status(200).json({ data: result });
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }

    async deleteAPI(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await this.useCase.delete(id);
            res.status(200).json({ data: result });
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }

    async listAPI(req: Request, res: Response) {
        try {
            const {success, data: paging, error} = PagingDTOSchema.safeParse(req.query);
            if (!success) {
                res.status(400).json({ 
                    message: 'Invalid paging',
                    errors: error.message,
                 });
                 return;
            }

            const result = await this.useCase.list(req.query as Cond, paging);
            res.status(200).json({ data: result, paging, filter: req.query as Cond });

        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }
}