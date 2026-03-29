import { ContactActivityDTO } from "./ContactActivityDTO";

export interface ActivityWithContactDetailsDTO {
  activity: ContactActivityDTO;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
  };
}
