import { ActivityType } from "../../../../domain/src";

export interface ContactActivityEntity {
  id: number;
  personId: number;
  activityType: ActivityType;
  activityDate: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
