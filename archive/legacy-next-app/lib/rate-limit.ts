interface RateLimitEntry { count: number; resetAt: number }

const entries = new Map<string, RateLimitEntry>();

export function checkRateLimit(identifier: string, maxAttempts = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const current = entries.get(identifier);
  if (!current || current.resetAt <= now) {
    entries.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= maxAttempts) return false;
  current.count += 1;
  return true;
}

export function resetRateLimit(identifier: string): void {
  entries.delete(identifier);
}