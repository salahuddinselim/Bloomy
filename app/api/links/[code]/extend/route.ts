import { NextResponse } from "next/server";
import { extendShortLink } from "@/lib/links/store";

/**
 * Extends a short code's life by 30 days (see EXTENSION_SECONDS in
 * lib/links/store.ts). Gated client-side by a short ad-view timer on the
 * share page — there's no way to cryptographically prove an ad was actually
 * watched from a static AdSense placement, so this is an honor-system gate,
 * not a rewarded-ads integration. Anyone holding the code can call this;
 * the worst case is a sender extending their own link early, which is
 * harmless.
 */
export async function POST(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "invalid_code" }, { status: 400 });
  }

  const result = await extendShortLink(code);
  if (!result) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    expiresAt: new Date(Date.now() + result.expiresInSeconds * 1000).toISOString(),
    cappedAtMax: result.cappedAtMax,
  });
}
