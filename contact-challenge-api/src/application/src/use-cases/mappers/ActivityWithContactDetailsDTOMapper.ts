import { ActivityWithContactDetails } from "../../../../domain/src";
import { IMapper } from "../../interfaces/IMapper";
import { ContactActivityDTO } from "../dtos/ContactActivityDTO";

export class ActivityWithContactDetailsDTOMapper implements IMapper<
  ContactActivityDTO,
  ActivityWithContactDetails
> {
  toDTO(domain: ActivityWithContactDetails): ContactActivityDTO {
    const { activity } = domain;

    return {
      id: activity.id,
      personId: activity.personId,
      activityType: activity.activityType.toLowerCase() as
        | "call"
        | "meeting"
        | "email",
      activityDate: activity.activityDate,
      description: activity.description ?? null,
    };
  }

  toDomain(dto: ContactActivityDTO): ActivityWithContactDetails {
    return {
      activity: {
        id: dto.id,
        personId: dto.personId,
        activityType: dto.activityType.toUpperCase() as any,
        activityDate: dto.activityDate,
        description: dto.description ?? undefined,
      },
      contact: {
        firstName: "",
        lastName: "",
        email: "",
        birthDate: "",
      },
    };
  }
}