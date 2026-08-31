/*
 * VERCEL_URL is the current deployment's unique hash URL, which changes on
 * every deploy — using it as the canonical site origin would mean OG image,
 * sitemap, and canonical URLs baked into a production build point at a stale
 * preview URL as soon as the next deploy ships. VERCEL_PROJECT_PRODUCTION_URL
 * is the stable production domain and is what we want once VERCEL_ENV says
 * this build is production.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");
