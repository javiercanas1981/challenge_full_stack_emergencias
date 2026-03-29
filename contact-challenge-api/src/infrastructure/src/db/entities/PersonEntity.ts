import { AddressEntity } from "./AddressEntity";
import { PhoneEntity } from "./PhoneEntity";

export interface PersonEntity {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phones?: PhoneEntity[];
  addresses?: AddressEntity[];
  createdAt: string;
  updatedAt: string;
}
