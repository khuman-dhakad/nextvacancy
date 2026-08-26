/**
 * NEXTVACANCY In-Memory Rate Limiter
 * 
 * Implements a fixed-window token-bucket limiter for mitigating brute force
 * and automated scraping. In production multi-instance clusters, swap this with
 * an Upstash / Redis backed implementation.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Periodic cleanup of expired rate limit entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetAt <= now) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

export function checkRateLimit(
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 60 * 1000 // 1 minute window
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || entry.resetAt <= now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      remaining: maxAttempts - 1,
      reset: now + windowMs,
    };
  }

  if (entry.count >= maxAttempts) {
    return {
      success: false,
      remaining: 0,
      reset: entry.resetAt,
    };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: maxAttempts - entry.count,
    reset: entry.resetAt,
  };
}

export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}
