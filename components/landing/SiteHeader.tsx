import Link from "next/link";

/** Same header used on the landing/quotes pages, for content pages that had none. */
export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="font-script text-2xl italic text-charcoal">
        Bloomly
      </Link>
      <Link
        href="/create"
        className="rounded-full bg-burgundy px-4 py-2 text-sm font-medium text-ivory transition hover:bg-burgundy-dark"
      >
        Create a Bouquet
      </Link>
    </header>
  );
}
