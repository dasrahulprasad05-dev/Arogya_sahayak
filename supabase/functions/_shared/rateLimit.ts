// Sliding-window rate limiter utilizing Deno's native Key-Value store

export async function checkRateLimit(
  userId: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  try {
    // Open Deno KV database
    const kv = await Deno.openKv();
    const now = Date.now();
    const key = ['rate_limit', userId];
    
    const entry = await kv.get<number[]>(key);
    const timestamps = entry.value || [];
    
    // Filter timestamps within the active sliding window
    const activeTimestamps = timestamps.filter(t => now - t < windowMs);
    
    if (activeTimestamps.length >= limit) {
      const earliest = activeTimestamps[0];
      return {
        allowed: false,
        remaining: 0,
        reset: earliest + windowMs
      };
    }
    
    activeTimestamps.push(now);
    await kv.set(key, activeTimestamps);
    
    return {
      allowed: true,
      remaining: limit - activeTimestamps.length,
      reset: now + windowMs
    };
  } catch (err: any) {
    console.warn('Deno KV rate limiter fallback (bypassed):', err.message);
    return {
      allowed: true,
      remaining: limit,
      reset: Date.now() + windowMs
    };
  }
}
