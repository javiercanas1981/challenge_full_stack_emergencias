export interface IRepository<T, ID = number> {
  create(entity: T): Promise<T>;
  update(entity: T): Promise<void>;
  getById(id: ID): Promise<T | null>;
  delete(id: ID): Promise<void>;
  getAll(): Promise<T[]>;
}
