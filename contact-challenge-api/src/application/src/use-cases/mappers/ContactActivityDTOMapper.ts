import { ActivityType, ContactActivity } from "../../../../domain/src";
import { IMapper } from "../../interfaces/IMapper";
import { ContactActivityDTO } from "../dtos/ContactActivityDTO";

const activityTypeMap: Record<string, ActivityType> = {
  call: ActivityType.CALL,
  meeting: ActivityType.MEETING,
  email: ActivityType.EMAIL,
};

export class ContactActivityDTOMapper implements IMapper<
  ContactActivityDTO,
  ContactActivity
> {
  toDomain(dto: ContactActivityDTO): ContactActivity {
    return {
      id: dto.id ?? 0,
      personId: dto.personId,
      activityType: this.toActivityType(dto.activityType),
      activityDate: dto.activityDate,
      description: dto.description ?? undefined,
    };
  }

  toDTO(entity: ContactActivity): ContactActivityDTO {
    return {
      id: entity.id,
      personId: entity.personId,
      activityType: entity.activityType,
      activityDate: entity.activityDate,
      description: entity.description,
    };
  }

  private toActivityType(type: string): ActivityType {
    const result = activityTypeMap[type];
    if (!result) throw new Error(`Invalid activity type: ${type}`);
    return result;
  }
}
