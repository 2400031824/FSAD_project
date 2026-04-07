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
    db = drizzleSqlite(sqlite, { schema });
  } catch (error) {
    console.error("Failed to initialize SQLite database:", error);
    throw error;
  }
}

export { db };
