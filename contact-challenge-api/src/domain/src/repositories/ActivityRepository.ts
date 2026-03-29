import { ActivityWithContactDetails } from "../model/ActivityWithContactDetails";
import { ContactActivity } from "../model/ContactActivity";
import { IRepository } from "./IRepository";

export interface ActivityRepository extends IRepository<ContactActivity> {
  create(contactActivity: ContactActivity): Promise<ContactActivity>;
  findByPerson(personId: number): Promise<ContactActivity[]>;
  findByPersonAndType(
    personId: number,
    type: "call" | "meeting" | "email",
  ): Promise<ActivityWithContactDetails[]>;
  findByPersonWithContactDetails(
    personId: number,
  ): Promise<ActivityWithContactDetails[]>;
  findAllWithContactDetails(): Promise<ActivityWithContactDetails[]>;
  delete(id: number): Promise<void>;
}
