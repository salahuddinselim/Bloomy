import { NextResponse } from "next/server";
import { createShortLink } from "@/lib/links/store";
import { decodeBouquet } from "@/lib/bouquet/encoder";
import { LIMITS } from "@/lib/bouquet/types";

/**
 * Creates a short code for an already-encoded bouquet token. The long-form
 * `/b/[data]` link is still the source of truth and always works on its
 * own — this endpoint only stores that same token under a short lookup key
 * so a link is nicer to read, type, or fit in a QR code. Nothing here
 * accepts or stores a raw bouquet: only a token that already round-trips
 * through the same validation `/b/[data]` uses, so this can't become a
 * side channel for storing arbitrary data.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const token = (body as { token?: unknown } | null)?.token;
  if (typeof token !== "string" || token.length === 0 || token.length > LIMITS.MAX_URL_LENGTH) {
    return NextResponse.json({ error: "invalid_token" }, { status: 400 });
  }

  // Reject anything that isn't actually a decodable bouquet, so the store
  // can't be used to stash arbitrary opaque strings.
  const result = decodeBouquet(token);
  if (!result.ok) {
    return NextResponse.json({ error: "invalid_token" }, { status: 400 });
  }

  const code = await createShortLink(token);
  if (!code) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  return NextResponse.json({ code });
}
