import { PersonSearchCriteria } from "../../../application/src";
import { Person } from "../model/Person";
import { IRepository } from "./IRepository";

export interface PersonRepository extends IRepository<Person> {
  create(dto: Person): Promise<Person>;
  update(person: Person): Promise<void>;
  getById(id: number): Promise<Person | null>;
  delete(id: number): Promise<void>;
  getAll(): Promise<Person[]>;
  search(criteria: PersonSearchCriteria): Promise<Person[]>;
  findByEmail(email: string): Promise<Person | null>;
}
