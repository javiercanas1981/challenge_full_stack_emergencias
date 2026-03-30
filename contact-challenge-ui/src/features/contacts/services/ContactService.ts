import axios, { AxiosInstance } from "axios";
import {
  CreatePersonDTO,
  Person,
  PersonSearchParams,
  UpdatePersonDTO,
} from "../../../types/types";

const API_URL =
  (import.meta as any).env.VITE_API_URL || "http://localhost:8080";

class ContactService {
  private api: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_URL}/api/contacts`;
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private parseError(error: unknown): any {
    if (axios.isAxiosError(error)) {
      if (error.response?.data) {
        return error.response.data;
      }
      return { message: error.message || "Unknown error" };
    }
    return { message: "Unknown error" };
  }

  async getAll(): Promise<Person[]> {
    try {
      const response = await this.api.get<Person[]>("/");
      return response.data;
    } catch (error) {
      throw this.parseError(error);
    }
  }

  async search(params: PersonSearchParams): Promise<Person[]> {
    try {
      const response = await this.api.get<Person[]>("/search", { params });
      return response.data;
    } catch (error) {
      throw this.parseError(error);
    }
  }

  async getById(id: number): Promise<Person> {
    try {
      const response = await this.api.get<Person>(`/${id}`);
      return response.data;
    } catch (error) {
      throw this.parseError(error);
    }
  }

  async create(person: CreatePersonDTO): Promise<Person> {
    try {
      const response = await this.api.post<Person>("/", person);
      return response.data;
    } catch (error) {
      throw this.parseError(error);
    }
  }

  async update(id: number, person: UpdatePersonDTO): Promise<Person> {
    try {
      const response = await this.api.put<Person>(`/${id}`, person);
      return response.data;
    } catch (error) {
      throw this.parseError(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.api.delete(`/${id}`);
    } catch (error) {
      throw this.parseError(error);
    }
  }
}

export const contactService = new ContactService();
