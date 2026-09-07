import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/siteUrl";

/*
 * /b/ and /s/ are per-recipient bouquet pages, and /x/ is the short-link
 * redirect straight into /b/ — all infinite, near-duplicate in structure,
 * and often carrying a private message meant for one person. They're
 * excluded from crawling both for SEO (thin/duplicate content dilutes the
 * marketing pages) and privacy (a personal note shouldn't end up indexed).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/b/", "/s/", "/x/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
