/**
 * Single source of truth for routes that must NEVER be indexed or appear in the sitemap.
 *
 * Adding a path here:
 *  - Adds it to robots.txt `Disallow`.
 *  - Causes sitemap.ts to filter out any entry whose URL path begins with it.
 *
 * Pair every entry with `robots: { index: false, follow: false }` on the relevant
 * page/layout so the noindex is enforced at three layers: page metadata, robots.txt,
 * and sitemap omission.
 *
 * Path prefixes are matched against the URL pathname with `startsWith(...)`.
 * Use a trailing slash to match all children, e.g. "/dashboard/" matches
 * "/dashboard/anything" but NOT the bare "/dashboard" page (when that bare path
 * is itself indexable, like "/stack-builder").
 */
export const NOINDEX_PATH_PREFIXES = [
  "/admin/",
  "/api/",
  "/auth/",
  "/dashboard/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/quiz/results",
  "/plan/",
  "/shared/", // Reddit / share-link surfaces
  "/stack-builder/", // user-generated stack permalinks; bare /stack-builder index stays crawlable
  "/checkout/", // transactional, never indexable
  "/pdfs/", // sandbox today, gated paid content tomorrow
  "/out/", // affiliate redirects — no SEO value, leak link equity
] as const;

/**
 * Returns true if the given path (e.g. "/dashboard/profile") is on the noindex list.
 * Used by sitemap.ts to defensively filter entries.
 */
export function isNoindexPath(path: string): boolean {
  return NOINDEX_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
}
