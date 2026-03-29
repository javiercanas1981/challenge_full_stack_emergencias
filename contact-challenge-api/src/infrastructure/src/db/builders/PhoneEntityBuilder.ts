import { PhoneEntity } from "../entities/PhoneEntity";
import { PhoneTypeEntity } from "../entities/PhoneTypeEntity";

export class PhoneEntityBuilder {
  private phone: Partial<PhoneEntity> = {};

  withId(id: number) {
    this.phone.id = id;
    return this;
  }

  withPersonId(personId: number) {
    this.phone.personId = personId;
    return this;
  }

  withNumber(number: string) {
    this.phone.number = number;
    return this;
  }

  withPhoneType(phoneType: PhoneTypeEntity) {
    this.phone.phoneType = phoneType;
    return this;
  }

  withTimestamps(date: Date = new Date()) {
    this.phone.createdAt = date;
    this.phone.updatedAt = date;
    return this;
  }

  build(): PhoneEntity {
    return this.phone as PhoneEntity;
  }
}
