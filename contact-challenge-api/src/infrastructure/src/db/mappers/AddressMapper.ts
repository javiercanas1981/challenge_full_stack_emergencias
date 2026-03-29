import { Address } from "../../../../domain/src";
import { AddressEntity } from "../entities/AddressEntity";

export class AddressMapper {
  toDomain(entity: AddressEntity): Address {
    return {
      id: entity.id,
      personId: entity.personId,
      locality: entity.locality,
      street: entity.street,
      number: entity.number,
      notes: entity.notes ?? undefined,
    };
  }

  toPersistence(domain: Address): AddressEntity {
    return {
      id: domain.id,
      personId: domain.personId,
      locality: domain.locality,
      street: domain.street,
      number: domain.number,
      notes: domain.notes ?? undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
