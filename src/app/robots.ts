import type { MetadataRoute } from "next";
import { SITE_CANONICAL_URL } from "@/lib/constants";
import { NOINDEX_PATH_PREFIXES } from "@/lib/seo-blocklist";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Sourced from src/lib/seo-blocklist.ts so robots.txt and sitemap.ts stay in sync.
      // Note: /protocol is intentionally NOT disallowed. It's currently noindexed via its
      // layout (coming-soon state), but we want Google to be able to crawl it later when
      // it ships so it can see the metadata flip from noindex to indexable.
      disallow: [...NOINDEX_PATH_PREFIXES],
    },
    sitemap: `${SITE_CANONICAL_URL}/sitemap.xml`,
    host: SITE_CANONICAL_URL,
  };
}
