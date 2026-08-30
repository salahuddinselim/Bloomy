import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import type { Bouquet } from "./types";
import { validateBouquet } from "./validator";
import { LIMITS } from "./types";

export interface EncodeResult {
  ok: boolean;
  data?: string;
  error?: string;
}

/** Serializes a bouquet into a compact, URL-safe token. The URL is the storage. */
export function encodeBouquet(bouquet: Bouquet): EncodeResult {
  const json = JSON.stringify(bouquet);
  const data = compressToEncodedURIComponent(json);
  if (data.length > LIMITS.MAX_URL_LENGTH) {
    return { ok: false, error: "too_large" };
  }
  return { ok: true, data };
}

export interface DecodeResult {
  ok: boolean;
  bouquet?: Bouquet;
  error?: string;
}

/** Decodes and validates a bouquet token. Never trusts the payload blindly. */
export function decodeBouquet(token: string): DecodeResult {
  if (!token || token.length > LIMITS.MAX_URL_LENGTH) {
    return { ok: false, error: "malformed" };
  }
  // Route params can arrive with '+' re-encoded as '%2B' depending on how the
  // link was constructed/navigated. lz-string's own alphabet never contains a
  // raw '%', so decoding first is always safe and undoes that corruption.
  let safeToken = token;
  try {
    safeToken = decodeURIComponent(token);
  } catch {
    // token wasn't percent-encoded — use it as-is
  }

  let json: string | null;
  try {
    json = decompressFromEncodedURIComponent(safeToken);
  } catch {
    return { ok: false, error: "malformed" };
  }
  if (!json) return { ok: false, error: "malformed" };

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: "malformed" };
  }

  const result = validateBouquet(parsed);
  if (!result.valid || !result.bouquet) {
    return { ok: false, error: result.error ?? "invalid" };
  }
  return { ok: true, bouquet: result.bouquet };
}

export function buildShareUrl(token: string, origin?: string) {
  const base = origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/b/${token}`;
}
