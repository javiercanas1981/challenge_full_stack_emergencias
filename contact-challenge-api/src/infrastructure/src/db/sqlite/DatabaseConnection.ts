import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private db: Database | null = null;

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect(): Promise<Database> {
    console.log(
      "Connecting to DB at:",
      require("path").resolve("./database.sqlite"),
    );
    if (this.db) {
      return this.db;
    }

    this.db = await open({
      filename: "./database.sqlite",
      driver: sqlite3.Database,
    });

    await this.createTables();
    return this.db;
  }

  public async createTables(): Promise<void> {
    if (!this.db) throw new Error("Database not connected");

    this.db.run("DROP TABLE IF EXISTS Phone");
    this.db.run("DROP TABLE IF EXISTS Address");
    this.db.run("DROP TABLE IF EXISTS ContactActivity");
    this.db.run("DROP TABLE IF EXISTS Person");
    this.db.run("DROP TABLE IF EXISTS PhoneType");

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS Person (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        dateOfBirth TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS PhoneType (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        typeName TEXT NOT NULL UNIQUE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS Phone (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personId INTEGER NOT NULL,
        number TEXT NOT NULL,
        phoneTypeId INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (personId) REFERENCES Person(id) ON DELETE CASCADE,
        FOREIGN KEY (phoneTypeId) REFERENCES PhoneType(id)
      );

      CREATE TABLE IF NOT EXISTS Address (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personId INTEGER NOT NULL,
        street TEXT NOT NULL,
        locality TEXT NOT NULL,
        number INTEGER NOT NULL,
        notes TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (personId) REFERENCES Person(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS ContactActivity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personId INTEGER NOT NULL,
        activityType TEXT NOT NULL CHECK(activityType IN ('call', 'meeting', 'email')),
        activityDate TEXT NOT NULL,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (personId) REFERENCES Person(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_persons_email ON Person(email);
      CREATE INDEX IF NOT EXISTS idx_person_name ON Person(firstName, lastName);
      CREATE INDEX IF NOT EXISTS idx_phone_number ON Phone(number);
      CREATE INDEX IF NOT EXISTS idx_activity_person ON ContactActivity(personId);
      CREATE INDEX IF NOT EXISTS idx_activity_type ON ContactActivity(activityType);
    `);

    const phoneTypes = ["mobile", "home", "work"];
    for (const type of phoneTypes) {
      await this.db.run(
        `INSERT OR IGNORE INTO PhoneType (typeName) VALUES (?)`,
        type,
      );
    }
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}
