import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/landing/Footer";

export const metadata = { title: "About Bloomly" };

const moments = [
  {
    title: "For everyday affection",
    body: "Not every warm thought needs a delivery truck. A quick bouquet can say thinking of you, thank you, or I hope today is easier — sent the moment you feel it.",
  },
  {
    title: "For long distance",
    body: "When shipping is slow, expensive, or simply impossible across a border, a link still arrives instantly, in color, with a message attached.",
  },
  {
    title: "For birthdays and milestones",
    body: "Pair a bouquet with a call, a card, or a real gift on the way — it adds a little ceremony without turning the gesture into a checkout flow.",
  },
  {
    title: "For an apology, or a quiet check-in",
    body: "Some feelings are easier to send as flowers and a few careful words than as a wall of text.",
  },
];

export default function AboutPage() {
  return (
    <main className="flex flex-col">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24">
        <p className="font-script text-lg italic text-dusty-rose">about bloomly</p>
        <h1 className="mt-2 font-display text-4xl text-charcoal sm:text-5xl">
          A gesture, not a checkout.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-charcoal-soft sm:text-lg">
          Bloomly sits in the space between a text message and a delivered gift. It gives a warm
          thought some shape — real flowers to arrange, a note that doesn&apos;t fade, and a
          single link that opens beautifully wherever it&apos;s sent.
        </p>

        <div className="mt-14">
          <h2 className="font-display text-2xl text-charcoal">Why a link instead of a database</h2>
          <p className="mt-3 text-sm leading-relaxed text-charcoal-soft">
            Every bouquet — its flowers, wrapping, ribbon, recipient, and message — is encoded
            directly into the URL you share. There&apos;s no account to create and no server
            storing what you send. That makes Bloomly free to run forever, and it means the only
            copy of your bouquet is the one in the link itself, so share it only with the person
            it&apos;s meant for.
          </p>
        </div>

        <div className="mt-14">
          <h2 className="font-display text-2xl text-charcoal">When to send one</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {moments.map((m) => (
              <div key={m.title} className="rounded-2xl border border-charcoal/10 bg-paper p-5">
                <h3 className="font-display text-base text-charcoal">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-soft">{m.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <h2 className="font-display text-2xl text-charcoal">Color, or monochrome</h2>
          <p className="mt-3 text-sm leading-relaxed text-charcoal-soft">
            Every bouquet can be built lush and bright, or switched to a quieter, graphic
            monochrome — the same arrangement, a different mood. Pick whichever fits the moment
            before you start arranging.
          </p>
        </div>

        <div className="mt-16 rounded-2xl border border-charcoal/10 bg-ivory-deep/40 p-8 text-center">
          <h2 className="font-display text-2xl text-charcoal">Start your bouquet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-charcoal-soft">
            Choose flowers, write the note, and get a link worth sending.
          </p>
          <Link
            href="/create"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-burgundy px-6 py-3 text-sm font-medium text-ivory transition hover:bg-burgundy-dark"
          >
            Create a Bouquet <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
