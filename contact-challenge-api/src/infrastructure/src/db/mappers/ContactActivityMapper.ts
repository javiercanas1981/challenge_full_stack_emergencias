import { ActivityWithContactRow } from "../..";
import {
  ActivityWithContactDetails,
  ContactActivity,
} from "../../../../domain/src";
import { ContactActivityEntity } from "../entities/ContactActivityEntity";
import { IMapper } from "../interfaces/IMapper";

type ActivityLike = {
  id: number;
  personId: number;
  activityType: any;
  activityDate: string;
  description?: string | null;
};

export class ContactActivityMapper implements IMapper<
  ContactActivity,
  ContactActivityEntity
> {
  toDomain(entity: ContactActivityEntity): ContactActivity {
    return this.mapToDomain(entity);
  }

  toPersistence(domain: ContactActivity): ContactActivityEntity {
    return {
      id: domain.id,
      personId: domain.personId,
      activityType: domain.activityType,
      activityDate: domain.activityDate,
      description: domain.description ?? undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  toWithContact(row: ActivityWithContactRow): ActivityWithContactDetails {
    return {
      activity: this.mapToDomain(row),
      contact: {
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        birthDate: row.dateOfBirth,
      },
    };
  }

  private mapToDomain(source: ActivityLike): ContactActivity {
    return {
      id: source.id,
      personId: source.personId,
      activityType: source.activityType,
      activityDate: source.activityDate,
      description: source.description ?? undefined,
    };
  }
}
