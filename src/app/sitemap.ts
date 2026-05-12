import type { MetadataRoute } from "next";
import { SITE_CANONICAL_URL } from "@/lib/constants";
import { getPublishedBlogPosts } from "@/data/blog";
import { getPublishedDemographicPages } from "@/data/demographic-pages";
import { CATEGORY_HUBS } from "@/data/category-hubs";
import { getGoalsForPeptide } from "@/data/goals";
import { getPublishedGuides } from "@/data/guides";
import { PEPTIDE_CATEGORIES } from "@/data/peptide-categories";
import { getPublishedPeptides } from "@/data/peptides";
import { getActiveVendors } from "@/data/vendors";
import { isNoindexPath } from "@/lib/seo-blocklist";

/**
 * Sitemap policy:
 *  - Only routes that should be indexed appear here.
 *  - Never add: /pdfs, /checkout, /dashboard, /admin, /auth, /quiz/results,
 *    /plan/[id], /shared/[id], /stack-builder/[id], /protocol, /out.
 *    (Full list in src/lib/seo-blocklist.ts.)
 *  - The bare /stack-builder index IS indexed; only its [id] children are not.
 *  - As a safety net the final return runs every entry through `isNoindexPath`
 *    so any accidental addition is filtered out at build time.
 */
const url = (path: string) => `${SITE_CANONICAL_URL}${path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: url("/peptides"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/vendors"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/stack-builder"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/quiz"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/tools"), lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: url("/tools/reconstitution"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/tools/cost"), lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: url("/tools/convert"), lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: url("/tools/wada-checker"), lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: url("/tools/dosing-cadence"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/tools/coa-check"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/guides"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: url("/compare/peptides"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: url("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const peptideEntries: MetadataRoute.Sitemap = getPublishedPeptides().map((peptide) => ({
    url: url(`/peptides/${peptide.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  // Per-peptide tool variants — three tools each generate one page per peptide.
  const perPeptideToolEntries: MetadataRoute.Sitemap = getPublishedPeptides().flatMap((peptide) => [
    {
      url: url(`/tools/reconstitution/${peptide.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: url(`/tools/cost/${peptide.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    },
    {
      url: url(`/tools/wada-checker/${peptide.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]);

  const vendorEntries: MetadataRoute.Sitemap = getActiveVendors().map((vendor) => ({
    url: url(`/vendors/${vendor.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const goalHubEntries: MetadataRoute.Sitemap = CATEGORY_HUBS.map((hub) => ({
    url: url(`/goals/${hub.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const peptideCategoryEntries: MetadataRoute.Sitemap = PEPTIDE_CATEGORIES.map((c) => ({
    url: url(`/peptides/category/${c.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = getPublishedBlogPosts().map((post) => ({
    url: url(`/blog/${post.slug}`),
    lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const demographicEntries: MetadataRoute.Sitemap = getPublishedDemographicPages().map((p) => ({
    url: url(`/blog/peptides-for/${p.slug}`),
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const guideEntries: MetadataRoute.Sitemap = getPublishedGuides().map((guide) => ({
    url: url(`/guides/${guide.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Curated peptide-vs-peptide comparison pairs — same logic as the route's generateStaticParams.
  const allPeptides = getPublishedPeptides();
  const seenPairs = new Set<string>();
  const pairEntries: MetadataRoute.Sitemap = [];
  for (let i = 0; i < allPeptides.length; i++) {
    const p1 = allPeptides[i];
    const p1Goals = new Set(getGoalsForPeptide(p1.id).map((g) => g.id));
    for (let j = i + 1; j < allPeptides.length; j++) {
      const p2 = allPeptides[j];
      const sameCategory = p1.category === p2.category;
      const sharesGoal = getGoalsForPeptide(p2.id).some((g) => p1Goals.has(g.id));
      if (!sameCategory && !sharesGoal) continue;
      const [a, b] = p1.slug < p2.slug ? [p1.slug, p2.slug] : [p2.slug, p1.slug];
      const key = `${a}-vs-${b}`;
      if (seenPairs.has(key)) continue;
      seenPairs.add(key);
      pairEntries.push({
        url: url(`/compare/peptides/${key}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.75,
      });
    }
  }

  const allEntries: MetadataRoute.Sitemap = [
    ...staticEntries,
    ...peptideEntries,
    ...peptideCategoryEntries,
    ...perPeptideToolEntries,
    ...vendorEntries,
    ...goalHubEntries,
    ...guideEntries,
    ...blogEntries,
    ...demographicEntries,
    ...pairEntries,
  ];

  // Defense in depth: drop any entry whose pathname is on the noindex blocklist.
  // This prevents accidental crawl-budget leaks if a future contributor adds a
  // noindexed route here without realizing it.
  return allEntries.filter((entry) => {
    try {
      const path = new URL(entry.url).pathname;
      return !isNoindexPath(path);
    } catch {
      return true;
    }
  });
}
