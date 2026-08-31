import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "./index";
import path from "node:path";

export async function runMigrations() {
  console.log("⏳ Applying PostgreSQL database migrations...");
  try {
    const migrationsFolder = path.join(process.cwd(), "lib/db/migrations");
    await migrate(db, { migrationsFolder });
    console.log("✅ All migrations applied successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
