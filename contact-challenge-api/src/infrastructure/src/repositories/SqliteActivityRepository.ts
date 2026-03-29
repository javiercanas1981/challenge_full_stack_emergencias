import {
  ActivityRepository,
  ActivityWithContactDetails,
  ContactActivity,
} from "../../../domain/src";
import { ContactActivityMapper } from "../db/mappers/ContactActivityMapper";

export class SqliteActivityRepository implements ActivityRepository {
  constructor(
    private db: any,
    private contactActivityMapper: ContactActivityMapper,
  ) {}
  update(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getById(): Promise<ContactActivity | null> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<ContactActivity[]> {
    throw new Error("Method not implemented.");
  }

  async create(contactActivity: ContactActivity): Promise<ContactActivity> {
    const persistence = await this.db.run(
      `INSERT INTO ContactActivity (personId, activityType, activityDate, description, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      contactActivity.personId,
      contactActivity.activityType,
      contactActivity.activityDate,
      contactActivity.description ?? null,
      new Date(),
      new Date(),
    );

    const id = persistence.lastID;

    const row = await this.db.get(
      `SELECT * FROM ContactActivity WHERE id = ?`,
      id,
    );
    return this.contactActivityMapper.toDomain(row);
  }

  async findByPersonAndType(
    personId: number,
    type: "call" | "meeting" | "email",
  ): Promise<ActivityWithContactDetails[]> {
    const rows = await this.db.all(
      `
      SELECT 
        a.*,
        p.firstName,
        p.lastName,
        p.email,
        p.dateOfBirth
      FROM ContactActivity a
      JOIN Person p ON p.id = a.personId
      WHERE a.personId = ? AND a.activityType = ?
      ORDER BY a.activityDate DESC
    `,
      personId,
      type,
    );

    return rows.map((row: any) =>
      this.contactActivityMapper.toWithContact(row),
    );
  }

  async findAllWithContactDetails(): Promise<ActivityWithContactDetails[]> {
    const rows = await this.db.all(`
    SELECT 
      a.*,
      p.firstName,
      p.lastName,
      p.email,
      p.dateOfBirth
    FROM ContactActivity a
    JOIN Person p ON p.id = a.personId
    ORDER BY a.activityDate DESC
  `);

    return rows.map((row: any) =>
      this.contactActivityMapper.toWithContact(row),
    );
  }
  async findByPersonWithContactDetails(
    personId: number,
  ): Promise<ActivityWithContactDetails[]> {
    const rows = await this.db.all(
      `
      SELECT 
        a.*,
        p.firstName,
        p.lastName,
        p.email,
        p.dateOfBirth
      FROM ContactActivity a
      JOIN Person p ON p.id = a.personId
      WHERE a.personId = ?
      ORDER BY a.activityDate DESC
    `,
      personId,
    );

    return rows.map((row: any) =>
      this.contactActivityMapper.toWithContact(row),
    );
  }

  async findByPerson(personId: number): Promise<ContactActivity[]> {
    const rows = await this.db.all(
      `
      SELECT * 
      FROM ContactActivity 
      WHERE personId = ? 
      ORDER BY activityDate DESC
    `,
      personId,
    );

    return rows.map((row: any) => this.contactActivityMapper.toDomain(row));
  }

  async delete(id: number): Promise<void> {
    await this.db.run(`DELETE FROM ContactActivity WHERE id = ?`, id);
  }
}
