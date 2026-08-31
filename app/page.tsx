import Link from "next/link";
import { ArrowRight, Download, Heart, Link2, QrCode, Sparkles } from "lucide-react";
import { BouquetCanvas } from "@/components/bouquet/BouquetCanvas";
import { BouquetAsset } from "@/components/bouquet/BouquetAsset";
import { PRESETS } from "@/data/presets";
import { OCCASIONS } from "@/data/occasions";
import { elementsFromIds } from "@/lib/bouquet/build";
import { createEmptyBouquet } from "@/lib/bouquet/types";
import { FLOWERS, FLOWER_MEANINGS } from "@/data/flowers";
import { AdSlot } from "@/components/ads/AdSlot";
import { Footer } from "@/components/landing/Footer";
import { siteUrl } from "@/lib/siteUrl";

const heroBouquet = {
  ...createEmptyBouquet(),
  elements: elementsFromIds(["eucalyptus", "eucalyptus", "rose", "rose", "rose", "peony", "babys_breath", "babys_breath"]),
  wrapper: "cream_paper",
  ribbon: "silk_burgundy",
};

const libraryFlowers = FLOWERS.filter((f) =>
  ["rose", "peony", "tulip", "daisy", "sunflower", "orchid", "lily", "carnation", "ranunculus", "anemone", "dahlia", "zinnia"].includes(f.id)
);

const steps = [
  {
    n: "01",
    icon: Sparkles,
    title: "Design your bouquet",
    body: "Choose realistic flowers, foliage, wrapping and ribbon — or start from a preset. Arrange every stem just so.",
  },
  {
    n: "02",
    icon: Link2,
    title: "Share a link",
    body: "Your whole bouquet lives inside one link — no account, no database, nothing stored on a server.",
  },
  {
    n: "03",
    icon: Heart,
    title: "They open a gift",
    body: "The recipient sees an elegant reveal, your message and the flowers themselves — and can send one back.",
  },
];

const shareOptions = [
  {
    icon: Link2,
    title: "The link is the bouquet",
    body: "Every petal and message is encoded into the URL. Copy it, paste it, text it — it survives as long as it circles.",
  },
  {
    icon: QrCode,
    title: "A QR for in person",
    body: "Hand over a bouquet with a scan — perfect for a desk, a doorstep, or a card taped to a gift.",
  },
  {
    icon: Download,
    title: "A keepsake PNG, or a GIF",
    body: "Download the arranged bouquet as a high-res image — or as an animated GIF that travels as motion.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Bloomly",
  url: siteUrl,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  description:
    "Create a beautiful digital bouquet, write a personal message, and send it to someone special as a single link. Free, no account required.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function LandingPage() {
  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      {/* Header */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <a href="#" className="font-script text-2xl italic text-charcoal">
          Bloomly
        </a>
        <nav className="hidden items-center gap-7 text-sm text-charcoal-soft sm:flex">
          <a href="#library" className="transition hover:text-burgundy">Flowers</a>
          <Link href="/quotes" className="transition hover:text-burgundy">Card Messages</Link>
          <a href="#how-it-works" className="transition hover:text-burgundy">How it works</a>
          <a href="#share" className="transition hover:text-burgundy">Sharing</a>
          <Link href="/about" className="transition hover:text-burgundy">About</Link>
          <Link href="/create" className="rounded-full bg-burgundy px-5 py-2.5 text-sm font-medium text-ivory transition hover:bg-burgundy-dark">
            Create a Bouquet
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
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-script text-lg italic text-dusty-rose">a digital bouquet studio</p>
            <h1 className="mt-3 font-display text-4xl leading-[1.08] text-charcoal sm:text-5xl md:text-6xl">
              Send something
              <span className="italic text-burgundy"> beautiful.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-charcoal-soft sm:text-lg">
              Arrange a bouquet of painterly flowers, write a note that doesn&apos;t fade, and
              send it as nothing more than a link. Free forever — no account, no database.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/create"
                className="flex items-center gap-2 rounded-full bg-burgundy px-7 py-3.5 text-sm font-medium text-ivory shadow-sm transition hover:bg-burgundy-dark"
              >
                Create a Bouquet <ArrowRight size={16} />
              </Link>
              <a href="#library" className="text-sm font-medium text-charcoal-soft underline-offset-4 transition hover:text-burgundy hover:underline">
                See the flowers
              </a>
            </div>
            <p className="mt-9 text-xs uppercase tracking-[0.18em] text-charcoal-soft/60">
              Free · No account · Lives in the link
            </p>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <div className="rounded-[2rem] border border-charcoal/8 bg-paper p-5 shadow-[0_24px_60px_-24px_rgba(42,37,33,0.35)]">
              {/* A display-frame, the way an atelier would show one bouquet. */}
              <div className="overflow-hidden rounded-[1.5rem] bg-[linear-gradient(165deg,#f5edde,#efe4cd)]">
                <BouquetCanvas bouquet={heroBouquet} />
              </div>
              <div className="mt-5 flex items-center justify-between px-1">
                <div>
                  <p className="font-display text-sm text-charcoal">“For no reason at all.”</p>
                  <p className="mt-1 text-xs text-charcoal-soft/60">burgundy roses · peony · baby’s breath</p>
                </div>
                <span className="rounded-full border border-charcoal/12 px-3 py-1 text-xs uppercase tracking-widest text-charcoal-soft/70">
                  warm ivory
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flower strip */}
      <section className="overflow-hidden border-b border-charcoal/8 bg-ivory-deep/50 py-5">
        <p className="whitespace-nowrap text-center font-script text-xl italic text-charcoal-soft/70">
          roses &nbsp;·&nbsp; tulips &nbsp;·&nbsp; peonies &nbsp;·&nbsp; lilies &nbsp;·&nbsp; sunflowers &nbsp;·&nbsp; dahlias &nbsp;·&nbsp; orchids &nbsp;·&nbsp; daisies &nbsp;·&nbsp; carnations &nbsp;·&nbsp; ranunculus &nbsp;·&nbsp; anemones &nbsp;·&nbsp; zinnias
        </p>
      </section>

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
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {libraryFlowers.map((f) => (
            <div
              key={f.id}
              className="group rounded-2xl border border-charcoal/8 bg-ivory-deep/30 p-5 transition hover:-translate-y-1 hover:border-burgundy/25 hover:shadow-md"
            >
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-paper shadow-inner">
                <BouquetAsset type={f.id} category={f.category} className="h-20 w-20" />
              </div>
              <p className="mt-4 text-center font-display text-base text-charcoal">{f.name}</p>
              <p className="mt-1.5 text-center font-script text-sm italic leading-snug text-charcoal-soft/80">
                {FLOWER_MEANINGS[f.id] ?? "a quiet smile"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-y border-charcoal/8 bg-ivory-deep/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
          <p className="font-script text-base italic text-dusty-rose">unhurried, on purpose</p>
          <h2 className="mt-1 font-display text-3xl text-charcoal sm:text-4xl">How it works</h2>
          <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="relative border-l border-charcoal/10 pl-6 sm:border-l-0 sm:pl-0">
                <span className="font-script text-4xl italic text-dusty-rose/60">{step.n}</span>
                <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
                  <step.icon size={18} />
                </div>
                <h3 className="mt-4 font-display text-xl text-charcoal">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Share options */}
      <section id="share" className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
        <p className="font-script text-base italic text-dusty-rose">the bouquet travels light</p>
        <h2 className="mt-1 font-display text-3xl text-charcoal sm:text-4xl">Sent as a link, or a scan, or a picture</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-charcoal-soft">
          No app required on the other end. The recipient just follows the link — WhatsApp, iMessage,
          Telegram and even SMS give it a live preview before they open it.
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

      {/* Card messages */}
      <section className="border-y border-charcoal/8 bg-ivory-deep/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 sm:flex-row sm:items-center md:py-20">
          <div>
            <p className="font-script text-base italic text-dusty-rose">the words before the flowers</p>
            <h2 className="mt-1 font-display text-3xl text-charcoal sm:text-4xl">Find the note first</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal-soft">
              A card-message library for love, birthdays, thanks, missing someone, encouragement and
              friendship — each quote drops straight into the editor, already written for a note card.
            </p>
          </div>
          <Link
            href="/quotes"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-burgundy px-6 py-3 text-sm font-medium text-ivory transition hover:bg-burgundy-dark"
          >
            Browse the card library <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6">
        <AdSlot position="landing-mid" />
      </section>

      {/* Why free */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16 text-center md:py-24">
        <p className="font-script text-lg italic text-dusty-rose">why it&apos;s free</p>
        <h2 className="mt-2 font-display text-3xl text-charcoal sm:text-4xl">Nothing stored. Nothing standing in the way.</h2>
        <p className="mt-5 text-base leading-relaxed text-charcoal-soft">
          Bloomly has no accounts and no database — your bouquet is encoded entirely into the link
          you share. That means nothing to maintain, nothing to run, and no price that has to be
          paid back. The whole point is that a beautiful thought reaches someone without friction.
        </p>
        <Link
          href="/create"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-burgundy px-7 py-3.5 text-sm font-medium text-ivory transition hover:bg-burgundy-dark"
        >
          Create a Bouquet <ArrowRight size={16} />
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