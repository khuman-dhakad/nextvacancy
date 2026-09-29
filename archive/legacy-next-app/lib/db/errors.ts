export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

export function handleDatabaseError(operation: string, error: unknown): void {
  if (isProduction()) {
    console.error(`Database operation failed: ${operation}`);
    throw new Error(`Database operation failed: ${operation}`);
  }

  console.error(`Database operation failed: ${operation}`, error);
}