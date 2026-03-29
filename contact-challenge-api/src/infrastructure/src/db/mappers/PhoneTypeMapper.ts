import { PhoneType } from "../../../../domain/src";
import { PhoneTypeEntity } from "../entities/PhoneTypeEntity";

export class PhoneTypeMapper {
  static toDomain(entity: PhoneTypeEntity): PhoneType {
    return {
      id: entity.id,
      typeName: entity.typeName,
    };
  }

  static toPersistence(domain: PhoneType): PhoneTypeEntity {
    const now = new Date();
    return {
      id: domain.id,
      typeName: domain.typeName,
      createdAt: now,
      updatedAt: now,
    };
  }
}
