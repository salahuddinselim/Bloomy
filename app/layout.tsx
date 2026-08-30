import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

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
        {children}
      </body>
    </html>
  );
}
