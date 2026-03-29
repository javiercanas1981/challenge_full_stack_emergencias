import { Request, Response } from "express";

export interface ICrudController<T_Create, T_Update> {
  create(req: Request<{}, any, T_Create>, res: Response): Promise<void>;
  getAll(req: Request, res: Response): Promise<void>;
  getById(req: Request<{ id: string }>, res: Response): Promise<void>;
  update(
    req: Request<{ id: string }, any, T_Update>,
    res: Response,
  ): Promise<void>;
  delete(req: Request<{ id: string }>, res: Response): Promise<void>;
}
