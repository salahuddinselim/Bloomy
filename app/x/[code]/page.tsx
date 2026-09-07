import { redirect, notFound } from "next/navigation";
import { resolveShortLink } from "@/lib/links/store";

/**
 * The short-link entry point: `/x/<code>` looks up the long-form bouquet
 * token server-side and redirects straight to the real `/b/[data]` reveal
 * page, which still does all the actual decoding client-side exactly as it
 * always has. This route knows nothing about bouquets — only how to turn a
 * short code back into the long token it was created from.
 *
 * Short codes now have a real, extendable lifespan (see lib/links/store.ts)
 * rather than the long link's permanent one, so this can genuinely run out.
 * `notFound()` here renders this segment's own not-found.tsx — same on-brand
 * message a plain component would give, but with a real 404 status instead
 * of 200, which matters for search engines and any link-checking tool.
 */
export default async function ShortLinkPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const token = await resolveShortLink(code);
  if (!token) notFound();
  redirect(`/b/${encodeURIComponent(token)}`);
}
