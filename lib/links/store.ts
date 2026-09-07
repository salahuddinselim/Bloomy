import { createClient, type RedisClientType } from "redis";
import { createHash } from "node:crypto";

/*
 * Short links are the one piece of Bloomly that genuinely needs a server:
 * a short code has to point somewhere, and "somewhere" has to be something
 * that remembers it. Everything else about a bouquet still lives entirely
 * in the long-form `/b/[data]` link (the encoded bouquet itself) — that
 * long link NEVER expires and this store never touches it. This store only
 * maps a short code to that long token, nothing more, and now also tracks
 * how long that mapping lives: a short code starts with a real lifespan and
 * the sender can extend it (see `extendShortLink`) — the long link is the
 * permanent fallback underneath it the whole time.
 */

const url = process.env.REDIS_URL;

// One client per server instance, connected lazily and reused across
// requests — node-redis holds a real TCP connection, so reconnecting per
// request would be needless latency (and per-request connect/disconnect is
// what actually exhausts a small Redis plan's connection limit, not data
// volume). `clientPromise` also de-dupes concurrent cold-start connects.
let clientPromise: Promise<RedisClientType> | null = null;

async function getClient(): Promise<RedisClientType | null> {
  if (!url) return null;
  if (!clientPromise) {
    const client: RedisClientType = createClient({ url });
    client.on("error", (err) => {
      // node-redis requires an error listener or it throws on the next tick;
      // logging and letting callers' own try/catch handle the failed
      // operation is enough — a transient Redis blip should never crash the
      // app, only silently disable short links for that request.
      console.error("[links/store] Redis client error:", err);
    });
    clientPromise = client.connect().then(() => client);
  }
  try {
    return await clientPromise;
  } catch (err) {
    console.error("[links/store] Redis connection failed:", err);
    clientPromise = null; // let the next call retry a fresh connection
    return null;
  }
}

/** True once a REDIS_URL is actually configured for this deployment (does not guarantee it's reachable). */
export const shortLinksAvailable = Boolean(url);

const CODE_ALPHABET = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ"; // no 0/O/1/l/I — avoids look-alike codes in a shared link
const CODE_LENGTH = 8;
const MAX_ATTEMPTS = 5;
// A short link starts with a real, visible lifespan — long enough that
// nobody's gift link dies on them by surprise, short enough that "extend it"
// is a meaningful, honest offer rather than a fake button. The sender can
// extend it (see EXTENSION_SECONDS) as many times as they come back to do
// so; the long-form `/b/` link underneath never expires regardless.
const INITIAL_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const EXTENSION_SECONDS = 60 * 60 * 24 * 30; // +30 days per extension
// Hard ceiling so an unbounded extend loop can't grow one entry forever.
const MAX_TTL_SECONDS = 60 * 60 * 24 * 365; // 1 year

function randomCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

/** Stable, non-reversible key for "has this exact bouquet token already been given a short code?" */
function tokenKey(longToken: string): string {
  return `token:${createHash("sha256").update(longToken).digest("hex")}`;
}

export interface ShortLinkResult {
  code: string;
  /** Seconds remaining until this short code expires. */
  expiresInSeconds: number;
}

/**
 * Stores a bouquet's long-form token under a short code and returns it.
 * Idempotent: re-sharing the same bouquet (e.g. revisiting its share page)
 * reuses the code already minted for that exact token instead of spawning a
 * fresh one every time, so "extend this link" means something — there's one
 * code per bouquet to extend, not a new orphaned one on every visit.
 *
 * Returns null if no store is configured or reachable (dev without Redis,
 * or a transient outage) — callers fall back to sharing the long link,
 * which always works.
 */
export async function createShortLink(longToken: string): Promise<ShortLinkResult | null> {
  const client = await getClient();
  if (!client) return null;
  try {
    const tKey = tokenKey(longToken);
    const existingCode = await client.get(tKey);
    if (existingCode) {
      const ttl = await client.ttl(`link:${existingCode}`);
      if (ttl > 0) return { code: existingCode, expiresInSeconds: ttl };
      // Reverse index outlived the forward key somehow (clock skew, manual
      // deletion) — fall through and mint a fresh code rather than return a
      // dangling one.
    }

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const code = randomCode();
      // NX: only set if the code doesn't already exist, so a random collision
      // (astronomically unlikely at 8 chars, but checked anyway) never
      // silently overwrites someone else's bouquet.
      const ok = await client.set(`link:${code}`, longToken, { NX: true, EX: INITIAL_TTL_SECONDS });
      if (ok) {
        await client.set(tKey, code, { EX: INITIAL_TTL_SECONDS });
        return { code, expiresInSeconds: INITIAL_TTL_SECONDS };
      }
    }
    return null;
  } catch (err) {
    console.error("[links/store] createShortLink failed:", err);
    return null;
  }
}

/** Resolves a short code back to the long-form token, or null if unknown/expired/unconfigured/unreachable. */
export async function resolveShortLink(code: string): Promise<string | null> {
  const client = await getClient();
  if (!client) return null;
  try {
    return await client.get(`link:${code}`);
  } catch (err) {
    console.error("[links/store] resolveShortLink failed:", err);
    return null;
  }
}

export interface ExtendResult {
  expiresInSeconds: number;
  /** True if the extension was capped by MAX_TTL_SECONDS rather than applied in full. */
  cappedAtMax: boolean;
}

/**
 * Adds EXTENSION_SECONDS to a short code's remaining life (not a flat reset
 * — a link extended with a week left keeps that week, plus 30 more days).
 * Returns null if the code doesn't exist (already expired, or never did).
 */
export async function extendShortLink(code: string): Promise<ExtendResult | null> {
  const client = await getClient();
  if (!client) return null;
  try {
    const linkKey = `link:${code}`;
    const currentTtl = await client.ttl(linkKey);
    if (currentTtl <= 0) return null; // expired or unknown — nothing to extend

    const longToken = await client.get(linkKey);
    if (!longToken) return null;

    const cappedAtMax = currentTtl + EXTENSION_SECONDS > MAX_TTL_SECONDS;
    const newTtl = Math.min(currentTtl + EXTENSION_SECONDS, MAX_TTL_SECONDS);

    await client.expire(linkKey, newTtl);
    await client.expire(tokenKey(longToken), newTtl);

    return { expiresInSeconds: newTtl, cappedAtMax };
  } catch (err) {
    console.error("[links/store] extendShortLink failed:", err);
    return null;
  }
}

/**
 * Removes a short code's entry (e.g. in response to an abuse report). The
 * long-form `/b/[data]` link a short code points to is never affected —
 * there is nothing to "delete" there, since it was never stored anywhere.
 */
export async function deleteShortLink(code: string): Promise<void> {
  const client = await getClient();
  if (!client) return;
  try {
    const longToken = await client.get(`link:${code}`);
    await client.del(`link:${code}`);
    if (longToken) await client.del(tokenKey(longToken));
  } catch (err) {
    console.error("[links/store] deleteShortLink failed:", err);
  }
}
