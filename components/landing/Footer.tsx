import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-charcoal/8 bg-ivory px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 text-sm text-charcoal-soft sm:flex-row">
        <p className="font-display text-base text-charcoal">BloomStory</p>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/" className="hover:text-burgundy">Home</Link>
          <Link href="/about" className="hover:text-burgundy">About</Link>
          <Link href="/create" className="hover:text-burgundy">Create</Link>
          <Link href="/gallery" className="hover:text-burgundy">Gallery</Link>
          <Link href="/#how-it-works" className="hover:text-burgundy">How It Works</Link>
          <Link href="/privacy" className="hover:text-burgundy">Privacy</Link>
          <Link href="/terms" className="hover:text-burgundy">Terms</Link>
        </nav>
      </div>
      <p className="mx-auto mt-6 max-w-6xl text-center text-xs text-charcoal-soft/50 sm:text-left">
        No accounts, ever — your bouquet lives inside the long-form link you share, which always works entirely
        on its own.
      </p>
    </footer>
  );
}
