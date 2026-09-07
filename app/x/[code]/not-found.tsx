import Link from "next/link";

/**
 * Segment-scoped not-found UI for /x/[code]. Paired with calling notFound()
 * in page.tsx when a code doesn't resolve, this renders the same on-brand
 * message as before but with the HTTP status Next.js's built-in not-found
 * handling actually gives it: a real 404, not 200. A search engine or a
 * link-checker treating this as valid, indexable content would be wrong —
 * the short code genuinely doesn't point at anything anymore.
 */
export default function ShortLinkNotFound() {
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
