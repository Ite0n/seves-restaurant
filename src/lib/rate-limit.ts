type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  namespace: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfter: number };

const globalRateLimit = globalThis as typeof globalThis & {
  __sevesRateLimitStore?: Map<string, RateLimitBucket>;
};

const buckets =
  globalRateLimit.__sevesRateLimitStore ??
  (globalRateLimit.__sevesRateLimitStore = new Map<string, RateLimitBucket>());

function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(",");
    if (firstIp?.trim()) return firstIp.trim();
  }

  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

function pruneExpiredBuckets(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function checkRateLimit(
  request: Request,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  pruneExpiredBuckets(now);

  const key = `${options.namespace}:${getClientIdentifier(request)}`;
  const bucket = buckets.get(key);

  if (!bucket) {
    buckets.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return { allowed: true };
  }

  if (bucket.count >= options.limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true };
}
