import * as schema from "@shared/schema";

const databaseUrl = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === "production";

let db: any;

// Initialize database
if (isProduction && !databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required in production");
}

if (isProduction || databaseUrl?.includes("postgres")) {
  // PostgreSQL for production
  import("postgres").then((mod) => {
    const postgres = mod.default;
    import("drizzle-orm/postgres-js").then((drizzleModule) => {
      const { drizzle } = drizzleModule;
      const client = postgres(databaseUrl!);
      db = drizzle(client, { schema });
    });
  });
} else {
  // SQLite for development
  try {
    const Database = require("better-sqlite3");
    const { drizzle } = require("drizzle-orm/better-sqlite3");
    const sqlite = new Database("./Data/db.sqlite");
    db = drizzle(sqlite, { schema });
  } catch (error) {
    console.error("Failed to initialize SQLite database:", error);
    throw error;
  }
}

export { db };
