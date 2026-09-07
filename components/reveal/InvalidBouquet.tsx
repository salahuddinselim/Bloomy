import Link from "next/link";

export function InvalidBouquet() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="font-display text-2xl text-charcoal">
        Oops — this bouquet link doesn&apos;t look right.
      </p>
      <p className="max-w-sm text-sm text-charcoal-soft">
        It may have been altered, or the link is incomplete. BloomStory bouquets live entirely
        inside their link, so it needs to be copied exactly.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href="/create" className="rounded-full bg-burgundy px-5 py-2.5 text-sm font-medium text-ivory">
          Create a New Bouquet
        </Link>
        <Link href="/" className="rounded-full border border-charcoal/15 px-5 py-2.5 text-sm text-charcoal-soft">
          Go Home
        </Link>
      </div>
    </main>
  );
}
