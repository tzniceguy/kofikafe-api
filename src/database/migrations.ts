import "dotenv/config";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const sqlite = new Database(process.env.DB_FILE_NAME!);
const db = drizzle(sqlite);

async function main() {
  try {
    await migrate(db, {
      migrationsFolder: "./src/db/migrations",
    });
    console.log("Migration successful");
    sqlite.close();
  } catch (error) {
    console.error("Error during migrations", error);
    process.exit(1);
  }
}

main();
