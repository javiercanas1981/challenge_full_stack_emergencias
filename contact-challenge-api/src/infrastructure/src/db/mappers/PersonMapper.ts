import { Person } from "../../../../domain/src";
import { AddressEntityBuilder } from "../builders/AddressEntityBuilder";
import { PhoneEntityBuilder } from "../builders/PhoneEntityBuilder";
import { PersonEntity } from "../entities/PersonEntity";
import { IMapper } from "../interfaces/IMapper";

export class PersonMapper implements IMapper<Person, Partial<PersonEntity>> {
  toDomain(entity: any): Person {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      dateOfBirth: entity.dateOfBirth,
      email: entity.email,
      phones: entity.phones?.map((p: any) => ({
        id: p.id,
        number: p.number,
        personId: p.personId,
        phoneType: {
          id: p.phoneTypeId,
          typeName: p.phoneTypeName,
        },
      })),
      addresses: entity.addresses?.map((a: any) => ({
        id: a.id,
        personId: a.personId,
        street: a.street,
        locality: a.locality,
        number: a.number,
        notes: a.notes,
      })),
    };
  }

  toPersistence(domain: Person): Partial<PersonEntity> {
    const now = new Date();

    return {
      id: domain.id,
      firstName: domain.firstName,
      lastName: domain.lastName,
      dateOfBirth: domain.dateOfBirth,
      email: domain.email,
      phones: domain.phones?.map((p) =>
        new PhoneEntityBuilder()
          .withId(p.id)
          .withPersonId(p.personId)
          .withNumber(p.number)
          .withPhoneType({
            id: p.phoneType.id,
            typeName: p.phoneType.typeName,
            createdAt: now,
            updatedAt: now,
          })
          .withTimestamps(now)
          .build(),
      ),
      addresses: domain.addresses?.map((a) =>
        new AddressEntityBuilder()
          .withId(a.id)
          .withPersonId(a.personId)
          .withStreet(a.street)
          .withLocality(a.locality)
          .withNumber(a.number)
          .withNotes(a.notes)
          .withTimestamps(now)
          .build(),
      ),
    };
  }
}
