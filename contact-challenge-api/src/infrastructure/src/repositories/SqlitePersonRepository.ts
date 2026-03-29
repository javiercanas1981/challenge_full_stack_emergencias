import { PersonSearchCriteria } from "../../../application/src/index";
import { Person, PersonRepository } from "../../../domain/src";
import { PersonEntity } from "../db/entities/PersonEntity";
import { IMapper } from "../db/interfaces/IMapper";

export class SqlitePersonRepository implements PersonRepository {
  constructor(
    private db: any,
    private mapper: IMapper<Person, PersonEntity>,
  ) {}

  // Método privado para evitar repetir la lógica del JOIN en cada consulta
  private async getRelatedData(personId: number) {
    const phones = await this.db.all(
      `SELECT 
        p.id, p.number, p.personId, 
        pt.id as phoneTypeId, pt.typeName as phoneTypeName
       FROM Phone p
       JOIN PhoneType pt ON p.phoneTypeId = pt.id
       WHERE p.personId = ?`,
      [personId],
    );

    const addresses = await this.db.all(
      `SELECT * FROM Address WHERE personId = ?`,
      [personId],
    );

    return { phones, addresses };
  }

  async create(person: Person): Promise<Person> {
    const entity = this.mapper.toPersistence(person);
    const now = new Date().toISOString();

    const persistence = await this.db.run(
      `INSERT INTO Person (firstName, lastName, email, dateOfBirth, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      entity.firstName,
      entity.lastName,
      entity.email,
      entity.dateOfBirth,
      now,
      now,
    );

    const personId = persistence.lastID;

    if (entity.phones) {
      for (const p of entity.phones) {
        await this.db.run(
          `INSERT INTO Phone (personId, number, phoneTypeId, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?)`,
          personId,
          p.number,
          p.phoneType.id,
          now,
          now,
        );
      }
    }

    if (entity.addresses) {
      for (const a of entity.addresses) {
        await this.db.run(
          `INSERT INTO Address (personId, locality, street, number, notes, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          personId,
          a.locality,
          a.street,
          a.number,
          a.notes,
          now,
          now,
        );
      }
    }

    return (await this.getById(personId)) as Person;
  }

  async update(person: Person): Promise<void> {
    const entity = this.mapper.toPersistence(person);
    const now = new Date().toISOString();

    await this.db.run(
      `UPDATE Person 
       SET firstName = ?, lastName = ?, email = ?, dateOfBirth = ?, updatedAt = ?
       WHERE id = ?`,
      entity.firstName,
      entity.lastName,
      entity.email,
      entity.dateOfBirth,
      now,
      entity.id,
    );

    if (entity.phones) {
      await this.db.run(`DELETE FROM Phone WHERE personId = ?`, entity.id);
      for (const p of entity.phones) {
        await this.db.run(
          `INSERT INTO Phone (personId, number, phoneTypeId, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?)`,
          entity.id,
          p.number,
          p.phoneType.id,
          now,
          now,
        );
      }
    }

    if (entity.addresses) {
      await this.db.run(`DELETE FROM Address WHERE personId = ?`, entity.id);
      for (const a of entity.addresses) {
        await this.db.run(
          `INSERT INTO Address (personId, locality, street, number, notes, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          entity.id,
          a.locality,
          a.street,
          a.number,
          a.notes,
          now,
          now,
        );
      }
    }
  }

  async getById(id: number): Promise<Person | null> {
    const row = await this.db.get(`SELECT * FROM Person WHERE id = ?`, [id]);
    if (!row) return null;

    const { phones, addresses } = await this.getRelatedData(id);

    return this.mapper.toDomain({ ...row, phones, addresses });
  }

  async getAll(): Promise<Person[]> {
    const rows = await this.db.all(`SELECT * FROM Person`);
    const persons = [];
    for (const row of rows) {
      const { phones, addresses } = await this.getRelatedData(row.id);
      persons.push(this.mapper.toDomain({ ...row, phones, addresses }));
    }
    return persons;
  }

  async findByEmail(email: string): Promise<Person | null> {
    const row = await this.db.get(`SELECT * FROM Person WHERE email = ?`, [
      email,
    ]);
    if (!row) return null;

    const { phones, addresses } = await this.getRelatedData(row.id);
    return this.mapper.toDomain({ ...row, phones, addresses });
  }

  async search(criteria: PersonSearchCriteria): Promise<Person[]> {
    let sql = `
      SELECT DISTINCT p.*
      FROM Person p
      LEFT JOIN Phone ph ON ph.personId = p.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (criteria.email) {
      sql += ` AND p.email LIKE ?`;
      params.push(`%${criteria.email}%`);
    }
    if (criteria.firstName) {
      sql += ` AND p.firstName LIKE ?`;
      params.push(`%${criteria.firstName}%`);
    }
    if (criteria.lastName) {
      sql += ` AND p.lastName LIKE ?`;
      params.push(`%${criteria.lastName}%`);
    }
    if (criteria.phoneNumber) {
      sql += ` AND ph.number LIKE ?`;
      params.push(`%${criteria.phoneNumber}%`);
    }

    const rows = await this.db.all(sql, params);
    const persons = [];
    for (const row of rows) {
      const { phones, addresses } = await this.getRelatedData(row.id);
      persons.push(this.mapper.toDomain({ ...row, phones, addresses }));
    }
    return persons;
  }

  async delete(id: number): Promise<void> {
    await this.db.run(`DELETE FROM Person WHERE id = ?`, [id]);
  }
}
