import { ActivityType } from "./ActivityType";

export interface ContactActivity {
  id: number;
  personId: number;
  activityType: ActivityType;
  activityDate: string;
  description?: string;
}
