import * as schema from "@shared/schema";
import postgres from "postgres";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import Database from "better-sqlite3";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";

const databaseUrl = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === "production";

let db: any;

// Initialize database
if (isProduction && !databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required in production");
}

if (isProduction || databaseUrl?.includes("postgres")) {
  // PostgreSQL for production/Supabase
  const client = postgres(databaseUrl!, {
    ssl: databaseUrl?.includes("supabase.co") ? "require" : undefined,
  });
  db = drizzlePostgres(client, { schema });
} else {
  // SQLite for development
  try {
    const sqlite = new Database("./Data/db.sqlite");
    db = drizzleSqlite(sqlite, { schema });
  } catch (error) {
    console.error("Failed to initialize SQLite database:", error);
    throw error;
  }
}

export { db };
