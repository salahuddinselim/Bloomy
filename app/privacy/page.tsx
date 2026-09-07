import { Footer } from "@/components/landing/Footer";
import { SiteHeader } from "@/components/landing/SiteHeader";

const title = "Privacy Policy";
const description =
  "BloomStory's privacy policy: no accounts, no personal data collection. Every bouquet is encoded into the link itself; an optional short link stores only that same encoded data, keyed by a random code.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function PrivacyPage() {
  return (
    <main className="flex flex-col">
      <SiteHeader />
      <div className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="font-display text-3xl text-charcoal">Privacy Policy</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-charcoal-soft">
          <p>
            BloomStory does not require an account and does not collect personal information to
            operate. Every bouquet you create — its flowers, wrapping, recipient name, sender
            name, and message — is encoded directly into the link itself. That long link always
            works entirely on its own, with nothing uploaded or stored anywhere.
          </p>
          <p>
            When you generate a share link, BloomStory also tries to create a shorter version of
            it. Doing that means briefly storing that same encoded bouquet data — nothing more,
            no separate copy of your name or message — under a random short code, so the short
            link can be looked up and expanded back to the original. That entry is automatically
            deleted after 180 days, and is never used for anything besides answering &quot;what
            bouquet does this code point to?&quot; If short-link storage isn&apos;t available for any
            reason, the long link is shared instead and nothing is stored at all.
          </p>
          <p>
            Whoever holds a bouquet link — long or short — can view its contents, so only share it
            with the person you intend. We cannot see, recover, or delete an individual bouquet
            on your behalf.
          </p>
          <p>
            BloomStory does not use cookies for core functionality and does not install analytics or
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
