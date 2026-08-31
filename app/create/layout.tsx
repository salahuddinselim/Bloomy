import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a Bouquet",
  description:
    "Arrange real flowers, foliage, wrapping and ribbon into a digital bouquet, write a note, and get a link that opens beautifully anywhere. Free, no account required.",
  alternates: { canonical: "/create" },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
