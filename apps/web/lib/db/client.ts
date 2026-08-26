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

  const newPool = new Pool({
    connectionString: connectionString || "postgresql://postgres:postgres@localhost:5432/nextvacancy",
    max: process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX, 10) : 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl:
      process.env.NODE_ENV === "production" && process.env.DATABASE_SSL !== "false"
        ? { rejectUnauthorized: false }
        : false,
  });

  newPool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client", err);
  });

  if (process.env.NODE_ENV !== "production") {
    global.__nextvacancy_pg_pool = newPool;
  }

  return newPool;
}

const pool = getPool();

export const db: NodePgDatabase<typeof schema> = drizzle(pool, {
  schema,
  logger: process.env.NODE_ENV === "development" && process.env.DB_DEBUG === "true",
});

export { pool };
export * from "./schema";
