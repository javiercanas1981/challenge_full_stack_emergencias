import axios from "axios";
import {
  ActivitySearchCriteria,
  ContactActivity,
  CreateActivityDTO,
  Person,
} from "../../../types/types";

const API_URL =
  (import.meta as any).env.VITE_API_URL || "http://localhost:8080";

class ActivityService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_URL}/api/activities`;
  }

  async create(activity: CreateActivityDTO): Promise<ContactActivity> {
    const response = await axios.post<ContactActivity>(this.baseUrl, activity);
    return response.data;
  }

  async getByPersonId(personId: number): Promise<ContactActivity[]> {
    const response = await axios.get<ContactActivity[]>(
      `${this.baseUrl}/${personId}/activities`,
    );
    return response.data;
  }

  async search(criteria: ActivitySearchCriteria): Promise<
    Array<{
      activity: ContactActivity;
      contact: Person;
    }>
  > {
    const response = await axios.get(`${this.baseUrl}/search`, {
      params: {
        personId: criteria.personId,
        type: criteria.activityType,
        fromDate: criteria.fromDate,
        toDate: criteria.toDate,
      },
    });

    return response.data;
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}

export const activityService = new ActivityService();
