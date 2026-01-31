// Простой in-memory rate limit (dev-friendly). Для продакшена лучше Redis/Upstash.
// Сейчас не используется напрямую, но файл не должен быть пустым.

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

export function rateLimit(key: string, opts: { windowMs: number; max: number }) {
  const now = Date.now();
  const b = store.get(key);

  if (!b || b.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true as const, remaining: opts.max - 1, resetAt: now + opts.windowMs };
  }

  if (b.count >= opts.max) {
    return { ok: false as const, remaining: 0, resetAt: b.resetAt };
  }

  b.count += 1;
  return { ok: true as const, remaining: Math.max(0, opts.max - b.count), resetAt: b.resetAt };
}
