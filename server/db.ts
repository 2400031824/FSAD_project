import * as schema from "@shared/schema";
import postgres from "postgres";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import Database from "better-sqlite3";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import fs from "fs";
import path from "path";

const databaseUrl = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === "production";
const usePostgres = !!databaseUrl && (isProduction || databaseUrl.includes("postgres"));

let db: any;

const SQLITE_BOOTSTRAP_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  user_id INTEGER NOT NULL UNIQUE,
  department TEXT,
  cgpa TEXT,
  graduation_year INTEGER,
  resume_url TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS employers (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  user_id INTEGER NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  is_approved INTEGER DEFAULT false,
  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  employer_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  location TEXT NOT NULL,
  salary TEXT NOT NULL,
  posted_at INTEGER,
  FOREIGN KEY (employer_id) REFERENCES users(id) ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  job_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  status TEXT DEFAULT 'Applied' NOT NULL,
  current_round TEXT,
  remarks TEXT,
  applied_at INTEGER,
  updated_at INTEGER,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON UPDATE NO ACTION ON DELETE NO ACTION,
  FOREIGN KEY (student_id) REFERENCES users(id) ON UPDATE NO ACTION ON DELETE NO ACTION
);
`;

if (usePostgres) {
  // PostgreSQL for production/Supabase
  const client = postgres(databaseUrl!, {
    ssl: databaseUrl?.includes("supabase.co") ? "require" : undefined,
  });
  db = drizzlePostgres(client, { schema });
} else {
  // SQLite fallback (development and demo deployments without DATABASE_URL)
  try {
    const sqlitePath = isProduction ? "/tmp/db.sqlite" : "./Data/db.sqlite";

    if (isProduction) {
      const sourcePath = path.resolve(process.cwd(), "Data", "db.sqlite");
      if (!fs.existsSync(sqlitePath) && fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, sqlitePath);
      }
    }

    const sqlite = new Database(sqlitePath);
    sqlite.pragma("foreign_keys = ON");
    sqlite.exec(SQLITE_BOOTSTRAP_SQL);
    db = drizzleSqlite(sqlite, { schema });
  } catch (error) {
    console.error("Failed to initialize SQLite database:", error);
    throw error;
  }
}

export { db };
