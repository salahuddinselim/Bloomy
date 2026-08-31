import { Footer } from "@/components/landing/Footer";

export const metadata = { title: "Terms of Use", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <main className="flex flex-col">
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl text-charcoal">Terms of Use</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-charcoal-soft">
          <p>
            Bloomly is provided free of charge, as-is, with no warranty of any kind. It is a
            client-side tool for creating and sharing digital bouquets; it has no user accounts
            and no server-side storage of the content you create.
          </p>
          <p>
            You are responsible for what you put into a bouquet and who you share the resulting
            link with. Do not use Bloomly to send abusive, harassing, or unlawful content.
          </p>
          <p>
            Because bouquets are encoded entirely in the URL, anyone with the link can view it.
            Bloomly has no ability to moderate, remove, or recover content after a link has been
            created.
          </p>
          <p>These terms may be updated from time to time as the product evolves.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
