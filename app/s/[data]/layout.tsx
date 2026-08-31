import type { Metadata } from "next";

// The "your bouquet is ready" share screen — never meant to be a search
// result, and the page itself is a client component so metadata has to live
// in this sibling layout instead.
export const metadata: Metadata = {
  title: "Your Bouquet Is Ready",
  robots: { index: false, follow: false },
};

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
