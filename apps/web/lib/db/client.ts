import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

declare global {
  var __nextvacancy_pg_pool: Pool | undefined;
}

function getPool(): Pool {
  if (global.__nextvacancy_pg_pool) {
    return global.__nextvacancy_pg_pool;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString && process.env.NODE_ENV === "production") {
    throw new Error(
      "DATABASE_URL is required in production. Configure it before starting the application."
    );
  }

  const newPool = new Pool({
    connectionString: connectionString || undefined,
    max: process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX, 10) : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl:
      process.env.DATABASE_SSL === "true" ||
      (process.env.NODE_ENV === "production" && process.env.DATABASE_SSL !== "false")
        ? { rejectUnauthorized: false }
        : false,
  });

  newPool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client pool", err);
  });

  global.__nextvacancy_pg_pool = newPool;

  return newPool;
}

const pool = getPool();

export const db: NodePgDatabase<typeof schema> = drizzle(pool, {
  schema,
  logger: process.env.NODE_ENV === "development" && process.env.DB_DEBUG === "true",
});

export { pool };
export * from "./schema";
