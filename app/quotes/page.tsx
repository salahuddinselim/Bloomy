import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { QUOTE_CATEGORIES } from "@/data/quotes";
import { Footer } from "@/components/landing/Footer";
import { SiteHeader } from "@/components/landing/SiteHeader";

const FEATURED: { text: string; category: string }[] = [
  { text: "You make ordinary days feel softer.", category: "love" },
  { text: "A little bouquet for the part of my heart that is always thinking of you.", category: "love" },
  { text: "Wishing you a day that feels as bright as these flowers.", category: "birthday" },
  { text: "Thank you for showing up in a way I will not forget.", category: "thank_you" },
  { text: "I miss you in the small moments most.", category: "miss_you" },
  { text: "You do not have to bloom all at once.", category: "encouragement" },
  { text: "Life feels brighter with you in it.", category: "friendship" },
];

export const metadata = {
  title: "Bouquet Card Messages — Bloomly",
  description:
    "Find the words for your note before you build the bouquet. Card-ready messages for love, birthdays, thanks, missing someone, encouragement, and friendship — each drops straight into the Bloomly editor.",
  alternates: { canonical: "/quotes" },
};

export default function QuotesPage() {
  return (
    <main className="flex min-h-screen flex-col bg-ivory">
      <SiteHeader />

      <section className="mx-auto w-full max-w-3xl px-6 pb-8 pt-12 text-center">
        <p className="font-script text-lg italic text-dusty-rose">the words before the flowers</p>
        <h1 className="mt-2 font-display text-3xl text-charcoal sm:text-4xl">Bouquet card library</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-charcoal-soft">
          Find the words for the card before you create the bouquet. These message ideas are written for
          digital flowers, share links, and mobile cards — pick one and it lands straight in the editor,
          ready to read once the ribbon comes off.
        </p>
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 pb-14">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-soft/70">
            Start with love
          </p>
          {FEATURED.map((f) => {
            const cat = QUOTE_CATEGORIES.find((c) => c.id === f.category);
            return (
              <Link
                key={f.text}
                href={`/create?quote=${encodeURIComponent(f.text)}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-charcoal/10 bg-paper px-5 py-3.5 transition hover:-translate-y-0.5 hover:border-burgundy/30 hover:shadow-md"
              >
                <p className="font-script text-base italic leading-snug text-charcoal">“{f.text}”</p>
                <span className="shrink-0 text-[10px] uppercase tracking-widest text-dusty-rose">
                  {cat?.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 pb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-charcoal-soft/70">
          Choose the feeling before you write the card
        </p>
        <div className="mt-4 space-y-6">
          {QUOTE_CATEGORIES.map((cat) => (
            <details key={cat.id} className="group rounded-2xl border border-charcoal/10 bg-paper">
              <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left">
                <div>
                  <h2 className="font-display text-lg text-charcoal">{cat.heading}</h2>
                  <p className="mt-0.5 text-sm text-charcoal-soft/70">{cat.intro}</p>
                </div>
                <span className="shrink-0 text-xs text-charcoal-soft/60">{cat.quotes.length} card quotes</span>
              </summary>
              <ul className="border-t border-charcoal/8 px-5 py-3">
                {cat.quotes.map((q) => (
                  <li key={q} className="border-b border-charcoal/5 last:border-0">
                    <Link
                      href={`/create?quote=${encodeURIComponent(q)}`}
                      className="group/quote flex items-center justify-between gap-3 py-3"
                    >
                      <span className="font-script text-base italic leading-snug text-charcoal-soft transition group-hover/quote:text-burgundy">
                        “{q}”
                      </span>
                      <ArrowRight
                        size={14}
                        className="shrink-0 text-charcoal-soft/40 transition group-hover/quote:translate-x-1 group-hover/quote:text-burgundy"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 pb-20 text-center">
        <p className="text-sm text-charcoal-soft/70">
          Prefer to write your own? The message field is entirely yours.
        </p>
        <Link
          href="/create"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-burgundy px-6 py-3 text-sm font-medium text-ivory transition hover:bg-burgundy-dark"
        >
          Build the bouquet <ArrowRight size={15} />
        </Link>
      </section>

      <Footer />
    </main>
  );
}