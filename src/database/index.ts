import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

if (!process.env.DB_FILE_NAME) {
  throw new Error("DB_FILE_NAME environment variable is not set");
}
const sqlite = new Database(process.env.DB_FILE_NAME!);

export const db = drizzle(sqlite);
