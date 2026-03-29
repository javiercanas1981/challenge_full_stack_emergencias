import { Person } from "../../../../domain/src";
import { IMapper } from "../../interfaces/IMapper";
import { PersonDTO } from "../dtos/PersonDTO";

export class PersonDTOMapper implements IMapper<PersonDTO, Person> {
  private getPhoneTypeId(type: any): number {
    if (typeof type === "object" && type.id) return type.id;

    const map: Record<string, number> = { mobile: 1, home: 2, work: 3 };
    return map[String(type).toLowerCase()] || 1;
  }

  toDomain(dto: PersonDTO): Person {
    const personId = dto.id ?? 0;

    return {
      id: personId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      dateOfBirth: dto.dateOfBirth,
      email: dto.email,
      phones: (dto.phones ?? []).map((p) => ({
        id: p.id ?? 0,
        number: p.number,
        personId: personId,
        phoneType: {
          id: this.getPhoneTypeId(p.phoneType),
          typeName:
            typeof p.phoneType === "string"
              ? p.phoneType
              : p.phoneType.typeName,
        },
      })),
      addresses: (dto.addresses ?? []).map((a) => ({
        id: a.id ?? 0,
        personId: personId,
        street: a.street,
        locality: a.locality,
        number: Number(a.number),
        notes: a.notes,
      })),
    };
  }

  toDTO(entity: Person): PersonDTO {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      dateOfBirth: entity.dateOfBirth,
      email: entity.email,
      phones: (entity.phones ?? []).map((p) => ({
        id: p.id,
        number: p.number,
        personId: entity.id,
        phoneType: p.phoneType,
      })),
      addresses: (entity.addresses ?? []).map((a) => ({
        id: a.id,
        personId: entity.id,
        street: a.street,
        locality: a.locality,
        number: a.number,
        notes: a.notes,
      })),
    };
  }
}
