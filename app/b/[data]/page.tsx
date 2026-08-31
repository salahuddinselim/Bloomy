import type { Metadata } from "next";
import { decodeBouquet } from "@/lib/bouquet/encoder";
import { RevealExperience } from "@/components/reveal/RevealExperience";
import { InvalidBouquet } from "@/components/reveal/InvalidBouquet";
import { clipText } from "@/lib/utils";

/** Route params can arrive with '+' re-encoded as '%2B'; normalize once. */
function decodeToken(data: string) {
  try {
    return decodeURIComponent(data);
  } catch {
    return data;
  }
}

/** The shared link itself is the breadcrumb WhatsApp/Telegram/iMessage fetch — give it a real preview. */
export async function generateMetadata({ params }: { params: Promise<{ data: string }> }): Promise<Metadata> {
  const { data } = await params;
  const result = decodeBouquet(decodeToken(data));
  const bouquet = result.ok ? result.bouquet : undefined;
  const title = bouquet?.recipient ? `A bouquet for ${clipText(bouquet.recipient, 60)}` : "A bouquet for you";
  const description = bouquet?.message
    ? clipText(bouquet.message, 160)
    : "Someone made you something soft and beautiful.";

  return {
    title,
    description,
    // Per-recipient pages: excluded from search (see app/robots.ts too) —
    // the message on this page is meant for whoever holds the link, not for
    // search results.
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: "website",
      // og:image / twitter:image are injected automatically by the colocated
      // opengraph-image.tsx, which renders the very bouquet the link carries.
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BouquetPage({ params }: { params: Promise<{ data: string }> }) {
  const { data } = await params;
  const result = decodeBouquet(decodeToken(data));

  if (!result.ok || !result.bouquet) {
    return <InvalidBouquet />;
  }

  return <RevealExperience bouquet={result.bouquet} />;
}