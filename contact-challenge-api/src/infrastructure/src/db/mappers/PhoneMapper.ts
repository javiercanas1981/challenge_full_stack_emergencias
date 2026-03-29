import { Phone } from "../../../../domain/src";
import { PhoneEntity } from "../entities/PhoneEntity";
import { PhoneTypeMapper } from "./PhoneTypeMapper";

export class PhoneMapper {
  static toDomain(entity: PhoneEntity): Phone {
    return {
      id: entity.id,
      number: entity.number,
      personId: entity.personId,
      phoneType: PhoneTypeMapper.toDomain(entity.phoneType),
    };
  }

  static toPersistence(domain: Phone): PhoneEntity {
    const now = new Date();
    return {
      id: domain.id,
      number: domain.number,
      personId: domain.personId,
      phoneType: PhoneTypeMapper.toPersistence(domain.phoneType),
      createdAt: now,
      updatedAt: now,
    };
  }
}
