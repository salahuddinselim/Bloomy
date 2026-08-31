import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bloomly — Send Something Beautiful",
    short_name: "Bloomly",
    description:
      "Create a beautiful digital bouquet, write a personal message, and send it to someone special. Free, no account required.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf6ef",
    theme_color: "#8c1f2e",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
