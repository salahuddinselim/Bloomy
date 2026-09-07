import Link from "next/link";
import { ArrowRight, Heart, Link2, Sparkles } from "lucide-react";
import { PRESETS } from "@/data/presets";
import { OCCASIONS } from "@/data/occasions";
import { EMOTIONS } from "@/data/emotions";
import { elementsFromIds } from "@/lib/bouquet/build";
import { createEmptyBouquet } from "@/lib/bouquet/types";
import { FLOWERS } from "@/data/flowers";
import { Footer } from "@/components/landing/Footer";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FlowerCarousel } from "@/components/landing/FlowerCarousel";
import { SolarSystem } from "@/components/landing/SolarSystem";
import { siteUrl } from "@/lib/siteUrl";

const heroBouquet = {
  ...createEmptyBouquet(),
  elements: elementsFromIds([
    "eucalyptus",
    "eucalyptus",
    "eucalyptus",
    "babys_breath",
    "babys_breath",
    "rose",
    "rose",
    "peony",
    "tulip",
    "ranunculus",
    "daisy",
  ]),
  wrapper: "cream_paper",
  ribbon: "silk_burgundy",
};

const libraryFlowers = FLOWERS.filter((f) =>
  ["rose", "peony", "tulip", "daisy", "sunflower", "orchid", "lily", "carnation", "ranunculus", "anemone", "dahlia", "zinnia"].includes(f.id)
);

const shareOptions = [
  {
    icon: Link2,
    title: "The link is the bouquet",
    body: "Every petal and message is encoded into the URL. Copy it, paste it, text it — it lives as long as it circles.",
  },
  {
    icon: Heart,
    title: "A letter in the bouquet",
    body: "Your message travels sealed in a little envelope — tap it open and the words slip out.",
  },
  {
    icon: Sparkles,
    title: "A magical reveal",
    body: "Choose a presentation theme — moonlit garden, rainy evening, fairy lights — and watch their reaction.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "BloomStory",
  url: siteUrl,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  description:
    "Create a beautiful digital bouquet, write a note in a sealed envelope, and send someone a little piece of your heart. Free, no account required.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function LandingPage() {
  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* Header */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="font-script text-2xl italic text-charcoal">
          BloomStory
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-charcoal-soft sm:flex">
          <a href="#library" className="transition hover:text-burgundy">Flowers</a>
          <a href="#how-it-works" className="transition hover:text-burgundy">How it works</a>
          <Link href="/gallery" className="transition hover:text-burgundy">Gallery</Link>
          <Link href="/about" className="transition hover:text-burgundy">About</Link>
          <Link href="/create" className="rounded-full bg-burgundy px-5 py-2.5 text-sm font-medium text-ivory transition hover:bg-burgundy-dark">
            Create Your Bouquet
          </Link>
        </nav>
        <Link href="/create" className="rounded-full bg-burgundy px-4 py-2 text-sm font-medium text-ivory transition hover:bg-burgundy-dark sm:hidden">
          Create
        </Link>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-charcoal/8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-dusty-rose/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-sage/10 blur-3xl" />
        <div className="pointer-events-none absolute right-1/3 top-1/4 h-48 w-48 rounded-full bg-lavender/10 blur-3xl" />
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-script text-lg italic text-dusty-rose">a digital bouquet studio</p>
            <h1 className="mt-3 font-display text-4xl leading-[1.08] text-charcoal sm:text-5xl md:text-6xl">
              Don&apos;t just send flowers.
              <span className="italic text-burgundy"> Tell your story.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-charcoal-soft sm:text-lg">
              Some feelings are better expressed with flowers. Create the bouquet that says them, write a
              note in a sealed envelope, and send someone a little piece of your heart.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/create"
                className="flex items-center gap-2 rounded-full bg-burgundy px-7 py-3.5 text-sm font-medium text-ivory shadow-sm transition hover:bg-burgundy-dark"
              >
                Create Your Bouquet <ArrowRight size={16} />
              </Link>
              <a href="#how-it-works" className="text-sm font-medium text-charcoal-soft underline-offset-4 transition hover:text-burgundy hover:underline">
                See How It Works
              </a>
            </div>
            <p className="mt-9 text-xs uppercase tracking-[0.18em] text-charcoal-soft/60">
              Free · No account · Lives in the link
            </p>
          </div>

          <SolarSystem bouquet={heroBouquet} />
        </div>
      </section>

      {/* Flower strip */}
      <section className="overflow-hidden border-b border-charcoal/8 bg-ivory-deep/50 py-5">
        <p className="whitespace-nowrap text-center font-script text-xl italic text-charcoal-soft/70">
          roses &nbsp;·&nbsp; tulips &nbsp;·&nbsp; peonies &nbsp;·&nbsp; lilies &nbsp;·&nbsp; sunflowers &nbsp;·&nbsp; dahlias &nbsp;·&nbsp; orchids &nbsp;·&nbsp; daisies &nbsp;·&nbsp; carnations &nbsp;·&nbsp; ranunculus &nbsp;·&nbsp; anemones &nbsp;·&nbsp; zinnias
        </p>
      </section>

      {/* How it works - Journey (animated progress) */}
      <HowItWorks />

      {/* Flower library */}
      <section id="library" className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-script text-base italic text-dusty-rose">the language of flowers</p>
            <h2 className="mt-1 font-display text-3xl text-charcoal sm:text-4xl">Every stem says something</h2>
          </div>
          <Link href="/create" className="text-sm font-medium text-burgundy underline-offset-4 hover:underline">
            Build with these flowers <ArrowRight className="inline" size={14} />
          </Link>
        </div>
        <FlowerCarousel flowers={libraryFlowers} />
      </section>

      {/* Emotions */}
      <section className="border-y border-charcoal/8 bg-ivory-deep/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
          <p className="font-script text-base italic text-dusty-rose">start with your heart</p>
          <h2 className="mt-1 font-display text-3xl text-charcoal sm:text-4xl">Every bouquet begins with a feeling</h2>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {EMOTIONS.map((e) => (
              <Link
                key={e.id}
                href="/create"
                className="rounded-full border border-charcoal/12 bg-paper px-4 py-2 text-sm text-charcoal-soft transition hover:border-burgundy/40 hover:text-burgundy"
              >
                {e.emoji} {e.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Share features */}
      <section id="share" className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
        <p className="font-script text-base italic text-dusty-rose">more than a link</p>
        <h2 className="mt-1 font-display text-3xl text-charcoal sm:text-4xl">A gift, not a message</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-charcoal-soft">
          Each bouquet lives inside one link — no app required. The recipient opens it to a cinematic
          reveal, your flowers, and a letter in a sealed envelope.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {shareOptions.map((s) => (
            <div key={s.title} className="rounded-2xl border border-charcoal/10 bg-paper p-6 transition hover:border-burgundy/25 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
                <s.icon size={18} />
              </div>
              <h3 className="mt-4 font-display text-lg text-charcoal">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Presets */}
      <section className="border-y border-charcoal/8 bg-ivory-deep/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
          <p className="font-script text-base italic text-dusty-rose">already imagined</p>
          <h2 className="mt-1 font-display text-3xl text-charcoal sm:text-4xl">Start from a preset</h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {PRESETS.slice(0, 3).map((p) => (
              <Link
                key={p.id}
                href={`/create?preset=${p.id}`}
                className="group rounded-2xl border border-charcoal/10 bg-paper p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="font-display text-lg text-charcoal">{p.name}</h3>
                <p className="mt-2 text-sm text-charcoal-soft">{p.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-burgundy opacity-0 transition group-hover:opacity-100">
                  Use this preset <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16 md:py-20">
        <h2 className="font-display text-2xl text-charcoal sm:text-3xl">For every occasion</h2>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {OCCASIONS.map((o) => (
            <Link
              key={o.id}
              href={`/create?occasion=${o.id}`}
              className="rounded-full border border-charcoal/12 bg-paper px-4 py-2 text-sm text-charcoal-soft transition hover:border-burgundy/40 hover:text-burgundy"
            >
              {o.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Why free */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16 text-center md:py-24">
        <p className="font-script text-lg italic text-dusty-rose">why it&apos;s free</p>
        <h2 className="mt-2 font-display text-3xl text-charcoal sm:text-4xl">No accounts. Nothing standing in the way.</h2>
        <p className="mt-5 text-base leading-relaxed text-charcoal-soft">
          BloomStory has no accounts — your bouquet is encoded entirely into the link you share,
          and that link always works completely on its own. That means nothing to maintain,
          nothing to run, and no price that has to be paid back. The whole point is that a
          beautiful thought reaches someone without friction.
        </p>
        <Link
          href="/create"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-burgundy px-7 py-3.5 text-sm font-medium text-ivory transition hover:bg-burgundy-dark"
        >
          Create Your Bouquet <ArrowRight size={16} />
        </Link>
      </section>

      {/* CTA */}
      <section className="border-t border-charcoal/8 bg-charcoal py-20 text-center">
        <p className="font-script text-xl italic text-dusty-rose">someone worth sending one to?</p>
        <h2 className="mt-3 font-display text-3xl text-ivory sm:text-4xl">Make something beautiful today.</h2>
        <Link
          href="/create"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ivory px-7 py-3.5 text-sm font-medium text-charcoal transition hover:bg-ivory-deep"
        >
          Create My Bouquet <ArrowRight size={16} />
        </Link>
      </section>

      <Footer />
    </main>
  );
}
