import { PhoneType } from "./PhoneType";

export interface Phone {
  id: number;
  number: string;
  personId: number;
  phoneType: PhoneType;
}
