import type { Metadata } from "next";

const title = "Create a Bouquet";
const description =
  "Arrange real flowers, foliage, wrapping and ribbon into a digital bouquet, write a note, and get a link that opens beautifully anywhere. Free, no account required.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/create" },
  openGraph: { title, description },
  twitter: { card: "summary_large_image", title, description },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
