import { AddressEntity } from "../entities/AddressEntity";

export class AddressEntityBuilder {
  private address: Partial<AddressEntity> = {};

  withId(id: number) {
    this.address.id = id;
    return this;
  }

  withPersonId(personId: number) {
    this.address.personId = personId;
    return this;
  }

  withStreet(street: string) {
    this.address.street = street;
    return this;
  }

  withLocality(locality: string) {
    this.address.locality = locality;
    return this;
  }

  withNumber(number: number) {
    this.address.number = number;
    return this;
  }

  withNotes(notes?: string) {
    this.address.notes = notes;
    return this;
  }

  withTimestamps(date: Date = new Date()) {
    this.address.createdAt = date.toISOString();
    this.address.updatedAt = date.toISOString();
    return this;
  }

  build(): AddressEntity {
    return this.address as AddressEntity;
  }
}
