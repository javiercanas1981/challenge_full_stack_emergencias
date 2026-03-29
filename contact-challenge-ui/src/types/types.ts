export interface CreatePhoneDTO {
  phoneNumber: string;
  phoneType: string;
}

export interface CreateAddressDTO {
  street: string;
  locality: string;
  number?: number;
  notes: string;
}

export interface CreatePersonDTO {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phones?: CreatePhoneDTO[];
  addresses?: CreateAddressDTO[];
}

export interface UpdatePhoneDTO {
  id?: number;
  phoneNumber: string;
  phoneType: string;
}

export interface UpdateAddressDTO {
  id?: number;
  street: string;
  locality: string;
  number?: number;
  notes: string;
}

export interface UpdatePersonDTO {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phones?: UpdatePhoneDTO[];
  addresses?: UpdateAddressDTO[];
}

export interface Contact {
  phones: Phone[];
  addresses: Address[];
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
}

export interface PhoneType {
  id: number;
  typeName: string;
}

export interface Phone {
  id: number;
  number: string;
  personId: number;
  phoneType: string | PhoneType;
}

export type FormPhone = {
  id: number;
  number: string;
  phoneType: string;
};

export interface Address {
  id?: number;
  personId?: number;
  street: string;
  locality: string;
  number?: number;
  notes: string;
}

export interface Person {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phones: Phone[];
  addresses: Address[];
}

export interface PersonSearchParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  phoneType?: string;
}

export interface PersonSearchCriteria {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  phoneType?: string;
}

export interface ContactActivity {
  id: number;
  personId: number;
  activityType: ActivityType;
  activityDate: string;
  description?: string;
}

export enum ActivityType {
  CALL = "call",
  MEETING = "meeting",
  EMAIL = "email",
}

export interface ActivitySearchCriteria {
  personId?: number;
  activityType?: ActivityType;
  fromDate?: string;
  toDate?: string;
}

export interface CreateActivityDTO {
  personId: number;
  activityType: ActivityType;
  activityDate: string;
  description?: string;
}

export interface ActivitySearchResult {
  activity: ContactActivity;
  contact: Person;
}

export interface ContactWithActivities extends Contact {
  activities?: ContactActivity[];
}
