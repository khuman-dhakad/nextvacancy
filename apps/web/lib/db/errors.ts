export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function handleDatabaseError(operation: string, error: unknown): void {
  console.error(`Database operation failed: ${operation}`, error);

  if (isProduction()) {
    throw new Error(
      `Database operation failed: ${operation}. Check DATABASE_URL, database migrations, and database availability.`
    );
  }

  console.warn(`Using development fallback after database operation failed: ${operation}`);
}