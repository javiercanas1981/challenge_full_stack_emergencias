export type ActivityWithContactRow = {
  id: number;
  personId: number;
  activityType: "call" | "meeting" | "email";
  activityDate: string;
  description?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
};
