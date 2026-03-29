import { Address } from "./Address";
import { Phone } from "./Phone";

export interface Person {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phones?: Phone[];
  addresses?: Address[];
}
