import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import { siteUrl } from "@/lib/siteUrl";
import "./globals.css";

const ADSENSE_CLIENT = "ca-pub-9963403374347904";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const script = Cormorant_Garamond({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BloomStory — Don't Just Send Flowers. Tell Your Story.",
    template: "%s · BloomStory",
  },
  description:
    "Create a beautiful digital bouquet, give every flower a meaning, and send someone a little piece of your heart. Free, no account required.",
  alternates: { canonical: "/" },
  verification: { google: "N5lOrXPtVkJjcyTSU0lmQRn50xBfHTSnTCqz99Nv5CA" },
  keywords: [
    "digital bouquet",
    "send flowers online",
    "virtual bouquet",
    "e-bouquet",
    "flower card message",
    "digital flowers link",
    "flower gifting",
    "personal bouquet",
  ],
  openGraph: {
    title: "BloomStory — Don't Just Send Flowers. Tell Your Story.",
    description:
      "Create a beautiful digital bouquet, give every flower a meaning, and send someone a little piece of your heart. Free, no account required.",
    siteName: "BloomStory",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BloomStory — Don't Just Send Flowers. Tell Your Story.",
    description:
      "Create a beautiful digital bouquet, give every flower a meaning, and send someone a little piece of your heart.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${script.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-charcoal font-body">
        {/* Plain <script>, not next/script: next/script stamps a data-nscript
            attribute on every tag it renders, which AdSense's own runtime
            diagnostics don't recognize and logs a console warning about.
            This script is rendered exactly once in the root layout, so we
            don't need next/script's dedup-across-navigation behavior. */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
        {children}
      </body>
    </html>
  );
}
