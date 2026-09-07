import { createClient, type RedisClientType } from "redis";

/*
 * Short links are the one piece of Bloomly that genuinely needs a server:
 * a short code has to point somewhere, and "somewhere" has to be something
 * that remembers it. Everything else about a bouquet still lives entirely
 * in the long-form `/b/[data]` link (the encoded bouquet itself) — this
 * store only maps a short code to that long token, nothing more. No names,
 * no messages are stored under any other key, and a code is only ever
 * looked up by the exact string a visitor's link contains.
 *
 * Connects to whatever REDIS_URL points at (a Vercel Marketplace Redis
 * instance in production, or a local/dev Redis if you set one). Missing
 * env var or a connection failure both mean "no short links this request" —
 * every caller falls back to the long link rather than erroring.
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
// Short links are a convenience, not the source of truth — the long `/b/`
// link never expires. Six months keeps the store from growing forever
// while comfortably outlasting how long anyone keeps a gift link around.
const TTL_SECONDS = 60 * 60 * 24 * 180;

function randomCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

/**
 * Stores a bouquet's long-form token under a fresh short code and returns
 * the code. Returns null if no store is configured or reachable (dev
 * without Redis, or a transient outage) — callers fall back to sharing the
 * long link, which always works.
 */
export async function createShortLink(longToken: string): Promise<string | null> {
  const client = await getClient();
  if (!client) return null;
  try {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const code = randomCode();
      // NX: only set if the code doesn't already exist, so a random collision
      // (astronomically unlikely at 8 chars, but checked anyway) never
      // silently overwrites someone else's bouquet.
      const ok = await client.set(`link:${code}`, longToken, { NX: true, EX: TTL_SECONDS });
      if (ok) return code;
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

/**
 * Removes a short code's entry (e.g. in response to an abuse report). The
 * long-form `/b/[data]` link a short code points to is never affected —
 * there is nothing to "delete" there, since it was never stored anywhere.
 */
export async function deleteShortLink(code: string): Promise<void> {
  const client = await getClient();
  if (!client) return;
  try {
    await client.del(`link:${code}`);
  } catch (err) {
    console.error("[links/store] deleteShortLink failed:", err);
  }
}
