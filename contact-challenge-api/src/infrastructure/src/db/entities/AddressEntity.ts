export interface AddressEntity {
  id: number;
  personId: number;
  locality: string;
  street: string;
  number: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
