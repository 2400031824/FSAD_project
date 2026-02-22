import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@shared/schema";

// Create SQLite database instance
const sqlite = new Database("./Data/db.sqlite");

// Create Drizzle instance
export const db = drizzle(sqlite, { schema });