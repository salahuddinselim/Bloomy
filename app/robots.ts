import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/siteUrl";

/*
 * /b/ and /s/ are per-recipient bouquet pages — infinite, near-duplicate in
 * structure, and often carry a private message meant for one person. They're
 * excluded from crawling both for SEO (thin/duplicate content dilutes the
 * marketing pages) and privacy (a personal note shouldn't end up indexed).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/b/", "/s/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
