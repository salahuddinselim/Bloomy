import type { Metadata } from "next";

const title = "Bouquet Gallery — Example Digital Bouquets";
const description =
  "Browse example digital bouquets for romance, birthdays, friendship, thank-yous, apologies, and just-because. Pick one and make it your own in the free bouquet editor.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/gallery" },
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
