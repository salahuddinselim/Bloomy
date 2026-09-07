import { redirect, notFound } from "next/navigation";
import { resolveShortLink } from "@/lib/links/store";

/**
 * The short-link entry point: `/x/<code>` looks up the long-form bouquet
 * token server-side and redirects straight to the real `/b/[data]` reveal
 * page, which still does all the actual decoding client-side exactly as it
 * always has. This route knows nothing about bouquets — only how to turn a
 * short code back into the long token it was created from.
 */
export default async function ShortLinkPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const token = await resolveShortLink(code);
  if (!token) notFound();
  redirect(`/b/${encodeURIComponent(token)}`);
}
