import { ContactActivity } from "./ContactActivity";

export interface ActivityWithContactDetails {
  activity: ContactActivity;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
  };
}
