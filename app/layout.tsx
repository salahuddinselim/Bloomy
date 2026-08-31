import type { Metadata } from "next";
import Script from "next/script";
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
  // Resolved from the deploy environment so the social card URLs always point
  // at the real origin — this was hardcoded to a placeholder domain before.
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bloomly — Send Something Beautiful",
    template: "%s · Bloomly",
  },
  description:
    "Create a beautiful digital bouquet, write a personal message, and send it to someone special. Free, no account required.",
  alternates: { canonical: "/" },
  verification: { google: "N5lOrXPtVkJjcyTSU0lmQRn50xBfHTSnTCqz99Nv5CA" },
  keywords: [
    "digital bouquet",
    "send flowers online",
    "virtual bouquet",
    "e-bouquet",
    "flower card message",
    "digital flowers link",
  ],
  openGraph: {
    title: "Bloomly — Send Something Beautiful",
    description:
      "Create a beautiful digital bouquet, write a personal message, and send it to someone special. Free, no account required.",
    siteName: "Bloomly",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bloomly — Send Something Beautiful",
    description:
      "Create a beautiful digital bouquet and send it to someone special.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${script.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-charcoal font-body">
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
