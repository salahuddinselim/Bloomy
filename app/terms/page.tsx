import { Footer } from "@/components/landing/Footer";
import { SiteHeader } from "@/components/landing/SiteHeader";

const title = "Terms of Use";
const description =
  "Terms of use for BloomStory, a free tool for creating and sharing digital bouquets with no accounts required.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function TermsPage() {
  return (
    <main className="flex flex-col">
      <SiteHeader />
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl text-charcoal">Terms of Use</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-charcoal-soft">
          <p>
            BloomStory is provided free of charge, as-is, with no warranty of any kind. It has no
            user accounts. Every bouquet is encoded directly into its long-form link, which always
            works entirely on its own with nothing stored anywhere and never expires. Sharing may
            also generate a shorter link, which stores that same encoded data (nothing more) under
            a random code for a limited time (currently 7 days), extendable by the sender by
            watching a short ad on their share page (up to a one-year maximum) — see the Privacy
            Policy for details.
          </p>
          <p>
            You are responsible for what you put into a bouquet and who you share the resulting
            link with. Do not use BloomStory to send abusive, harassing, or unlawful content.
          </p>
          <p>
            Because bouquets are encoded entirely in the URL, anyone with the link can view it.
            BloomStory does not review bouquet content and has no practical way to recover a
            bouquet if its link is lost. A short link's underlying entry can be removed on request
            (e.g. for abuse) — doing so does not affect the long-form link, which keeps working
            wherever it has already been shared.
          </p>
          <p>These terms may be updated from time to time as the product evolves.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
