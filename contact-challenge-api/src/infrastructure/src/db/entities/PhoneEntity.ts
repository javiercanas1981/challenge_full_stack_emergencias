import { PhoneTypeEntity } from "./PhoneTypeEntity";

export interface PhoneEntity {
  id: number;
  number: string;
  personId: number;
  phoneType: PhoneTypeEntity;
  createdAt: Date;
  updatedAt: Date;
}
