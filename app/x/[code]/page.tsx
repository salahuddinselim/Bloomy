import Link from "next/link";
import { redirect } from "next/navigation";
import { resolveShortLink } from "@/lib/links/store";

/**
 * The short-link entry point: `/x/<code>` looks up the long-form bouquet
 * token server-side and redirects straight to the real `/b/[data]` reveal
 * page, which still does all the actual decoding client-side exactly as it
 * always has. This route knows nothing about bouquets — only how to turn a
 * short code back into the long token it was created from.
 *
 * Short codes now have a real, extendable lifespan (see lib/links/store.ts)
 * rather than the long link's permanent one, so this can genuinely run out
 * — that's shown here as a soft, on-brand state rather than a generic 404,
 * since a recipient landing here is (unlike most 404s) very likely holding
 * a real gift link whose sender just didn't come back to extend it in time.
 */
export default async function ShortLinkPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const token = await resolveShortLink(code);
  if (token) redirect(`/b/${encodeURIComponent(token)}`);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-script text-lg italic text-dusty-rose">this one has faded</p>
      <h1 className="font-display text-2xl text-charcoal">This short link isn&apos;t valid anymore.</h1>
      <p className="max-w-sm text-sm leading-relaxed text-charcoal-soft">
        Short links have a limited lifespan and this one has run out. If whoever sent this kept their original
        share page, they can generate a new short link — or send you the full link, which never expires.
      </p>
      <Link
        href="/create"
        className="mt-2 rounded-full bg-burgundy px-6 py-3 text-sm font-medium text-ivory transition hover:bg-burgundy-dark"
      >
        Create your own bouquet
      </Link>
    </main>
  );
}
