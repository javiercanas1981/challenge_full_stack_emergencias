export interface ContactActivityDTO {
  id: number;
  personId: number;
  activityType: "call" | "meeting" | "email";
  activityDate: string;
  description?: string | null;
}
