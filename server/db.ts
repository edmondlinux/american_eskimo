import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const databaseUrl = process.env.NODE_ENV === 'production' ? process.env.MY_DATABASE_URL : (process.env.DATABASE_URL || process.env.MY_DATABASE_URL);

if (!databaseUrl) {
  throw new Error(
    "Database connection string must be set (MY_DATABASE_URL or DATABASE_URL).",
  );
}

export const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: databaseUrl.includes("neon.tech") ? { rejectUnauthorized: false } : false
});
export const db = drizzle(pool, { schema });
