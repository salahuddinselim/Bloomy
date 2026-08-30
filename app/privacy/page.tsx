import { Footer } from "@/components/landing/Footer";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <main className="flex flex-col">
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl text-charcoal">Privacy Policy</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-charcoal-soft">
          <p>
            Bloomly does not use a database, does not require an account, and does not collect
            personal information to operate. Every bouquet you create — its flowers, wrapping,
            recipient name, sender name, and message — is encoded directly into the link you
            share. Nothing is uploaded to or stored on a server.
          </p>
          <p>
            Because there is no server-side storage, we cannot see, recover, or delete a bouquet
            on your behalf. Whoever holds the link can view its contents, so only share it with
            the person you intend.
          </p>
          <p>
            Bloomly does not use cookies for core functionality and does not install analytics or
            tracking by default. If that ever changes, this page will be updated.
          </p>
          <p>
            The creator interface may use your browser&apos;s local storage solely to remember an
            in-progress draft on your own device. This is optional and never required for a
            shared link to work.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
