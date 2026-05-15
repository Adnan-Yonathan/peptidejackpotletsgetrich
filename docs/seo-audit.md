# PeptidePros Revenue SEO Audit

Date: 2026-05-14
Site: https://peptidepros.io
Goal: Grow qualified organic traffic that can convert into quiz starts, vendor clicks, signups, and paid protocol/PDF purchases.

## Executive Summary

PeptidePros has a strong SEO foundation for a new/early authority site: a real topical architecture, data-driven sitemap, live `robots.txt`, canonical apex host, noindex policy for private/transactional routes, per-template metadata, schema, dynamic OG images, functional tools, demographic pages, and `llms.txt`.

The biggest issue is not basic crawlability. The biggest issue is revenue capture and trust depth. The site already publishes 534 sitemap URLs, including 46 peptide profiles, 138 per-peptide tool pages, 267 comparison pages, 30 demographic posts, 10 guides, 8 goal hubs, and 2 vendor profiles. That is enough surface area to create indexation and internal-link risks if every template is not very intentional.

Top priority: fix confirmed broken internal goal links, improve page-specific social metadata, add canonicals to article/guide/goal templates, expand vendor/commercial pages, and add stronger source/citation/E-E-A-T layers for YMYL peptide content.

## Top 10 Findings

| Priority | Finding | Status | Impact | Effort | Recommendation |
| --- | --- | --- | --- | --- | --- |
| 1 | Related-goal links on peptide pages point to non-existent URLs such as `/goals/recovery`; live page returns 404 while valid hub is `/goals/recovery-injury-support`. | Confirmed | High | Low | Map `GoalData.id` values to `CATEGORY_HUBS.slug` before rendering `/goals/*`, or link these chips to `/peptides?goal=<id>` consistently. |
| 2 | Dynamic pages inherit generic `og:title`, `og:url`, and Twitter title/description from the root layout. BPC-157, blog, tool, and vendor pages all render `og:title=PeptidePros`. | Confirmed | High | Medium | Add page-specific OpenGraph/Twitter metadata to peptide, blog, guide, vendor, goal, comparison, and tool templates. |
| 3 | Blog post metadata lacks canonical alternates, and goal hub metadata also omits canonical alternates. | Confirmed | Medium-high | Low | Add `alternates: { canonical: ... }` to blog, guide, goal, and any other indexable dynamic templates missing it. |
| 4 | Only two vendor profiles are live in the sitemap, while "best peptide vendors" is one of the highest-commercial-intent clusters. | Confirmed | High | Medium | Expand vendor coverage and create vendor-category/comparison pages: best US peptide vendors, best COA vendors, Amino Club vs XL Peptides, vendor-by-peptide landing sections. |
| 5 | The sitemap includes 267 comparison pair pages. This can win long-tail SERPs, but it risks thin/near-duplicate pages if pair pages do not have strong unique answer blocks and intent-specific intros. | Confirmed risk | High | Medium | Keep only high-intent pairs indexable unless each pair has unique decision copy, FAQs, citations, and internal links. Consider noindexing weak generated pairs. |
| 6 | YMYL/E-E-A-T is directionally good but not strong enough for medical-adjacent peptide queries: content includes evidence tiers and warnings, but many pages do not surface named authors, reviewer policy, citations, source dates, or methodology near the top. | Confirmed risk | High | Medium | Add author/reviewer blocks, methodology pages, citation modules, "last reviewed" dates, and source footnotes on peptide, guide, comparison, and demographic templates. |
| 7 | Blog footprint is too small: sitemap has 1 standard blog post plus 30 demographic posts. Core commercial/informational topics are underbuilt. | Confirmed | Medium-high | Medium | Build a focused editorial backlog around "best peptide for X", "X vs Y", safety/regulatory explainers, vendor trust, and calculators. |
| 8 | Homepage has hardcoded library links that point broad topics back to `/blog` instead of the specific guide pages, weakening internal relevance. | Confirmed in repo | Medium | Low | Replace generic `/blog` links with specific guide or article URLs and add links to highest-value money pages. |
| 9 | Live headers for dynamic pages show `Cache-Control: private, no-cache, no-store`, `X-Vercel-Cache: MISS` for dynamic route checks. Static prerendered goal pages are cached. | Confirmed | Medium | Medium | Review Next route rendering/caching behavior for peptide/vendor/tool pages; static pages should not be regenerated per request unless required. |
| 10 | Conversion paths are present but not measured in the audit inputs. Quiz CTAs, affiliate `/out/*`, and PDF unlock CTAs exist, but ranking opportunities cannot yet be prioritized by revenue without GSC/GA event data. | Needs analytics | High | Medium | Track organic landing page to quiz start, quiz completion, outbound vendor click, PDF checkout start, and purchase. Use this to prune/expand SEO pages. |

## What Is Good

### Technical SEO

- `robots.txt` is live, points to `https://peptidepros.io/sitemap.xml`, allows public crawl, and blocks private or low-value paths including `/admin/`, `/api/`, `/dashboard/`, `/checkout/`, `/pdfs/`, `/out/`, saved plans, shared stacks, and quiz results.
- Apex canonical host is consistent. `https://www.peptidepros.io/peptides/bpc-157` 308 redirects to `https://peptidepros.io/peptides/bpc-157`.
- Sitemap is generated from repo data and filters against the noindex blocklist, reducing accidental indexation of private routes.
- Root metadata includes `metadataBase`, Organization schema, WebSite schema, SearchAction, favicon setup, and default robots index/follow.
- Dynamic OG images exist for key page families: peptide, blog, vendor, goals, and comparison pages.
- `llms.txt` is unusually strong for AI discovery: it summarizes the value prop, vendors, compound profiles, demographic pages, categories, goal hubs, guides, and tools.

### Content SEO

- The site has a clear topical map: peptide directory, categories, goal hubs, guides, demographic pages, vendor pages, tools, comparison pages, and quiz.
- Peptide pages have useful structured sections: overview, mechanism, route, study dose, expected effects, adverse effects, contraindications, regulatory flags, WADA/FDA warnings, costs, vendors, related guides, and related compounds.
- Blog and demographic templates use answer-first sections and FAQs, which are good for snippets and AI extraction.
- Tool pages are useful search assets, especially per-compound calculators such as BPC-157 reconstitution.
- Commercial trust language is present: "we do not sell peptides", affiliate disclosures, COA/vendor transparency, and RUO warnings.

### Revenue SEO

- The page architecture naturally supports several monetizable intents:
  - "best peptide vendors" and vendor review traffic.
  - "BPC-157 reconstitution calculator" and other tool traffic.
  - "tirzepatide vs semaglutide" comparison traffic.
  - "peptides for runners/bodybuilders/menopause/etc." demographic traffic.
  - peptide profile traffic that can route to quiz and vendors.
- Affiliate routes are centralized under `/out/*` and blocked from indexing, which protects crawl quality and link equity.
- CTAs are already embedded across the site: quiz, vendors, compare, stack builder, and PDF unlocks.

## What Is Bad

### Technical SEO

- Confirmed broken internal links exist from peptide pages to goal URLs using raw goal IDs. Example: `/goals/recovery` returns 404; valid sitemap URL is `/goals/recovery-injury-support`.
- Dynamic social metadata is generic. Search engines care less than social crawlers, but bad OG/Twitter metadata lowers share quality and weakens entity clarity.
- Several dynamic indexable templates miss explicit canonical alternates, leaving canonical behavior to defaults/root metadata.
- Sitemap `lastmod` values for many generated URLs all share the same build timestamp. That is acceptable, but weaker than content-aware dates for guides, peptides, and comparisons.
- The sitemap is large relative to the brand's likely current authority. 534 URLs is not a problem by itself, but generated comparison/tool pages should be monitored for "crawled, currently not indexed" and duplicate intent.

### Content SEO

- Standard blog content is thin as a program: one standard blog post in sitemap. Demographic pages help, but they do not replace core informational and commercial articles.
- Comparison pages are the biggest scale risk. If 267 pair pages have similar layouts and shallow unique copy, Google may treat many as low-value generated pages.
- Vendor content is underdeveloped for revenue SEO. Two vendor pages is not enough to dominate vendor-commercial SERPs or build trust across sourcing choices.
- Some internal links are broad placeholders. Homepage library links to `/blog` for topics that already have better guide targets.
- YMYL trust signals need to be more explicit. Peptide content needs visible sourcing, reviewer standards, update dates, and editorial methodology.

### Conversion SEO

- The site has many CTAs, but the highest-value path should be clearer per intent:
  - Informational pages should route to quiz or guide next.
  - Vendor-intent pages should route to vendor comparison and outbound clicks.
  - Tool pages should route to peptide profile, vendor options, and protocol PDF.
  - Demographic pages should route to quiz result personalization.
- Vendor clicks are visible but not sufficiently wrapped in "why this vendor" trust explanations near every outbound CTA.
- Paid protocol/PDF CTAs are not yet prominent across the pages most likely to pre-sell them: goal hubs, comparison pages, and tool pages.

## Revenue Opportunities

### Highest-Value Keyword Clusters

| Cluster | Example intent | Best page type | Revenue path |
| --- | --- | --- | --- |
| Vendor rankings | best peptide vendors, legit peptide vendors, peptide vendors with COA | Vendor hub and vendor comparison pages | Vendor clicks |
| Compound profiles | BPC-157, TB-500, CJC-1295, semaglutide peptide | Peptide profile | Quiz, vendor click, tool page |
| Calculators | BPC-157 reconstitution calculator, peptide dosage calculator, peptide cost calculator | Tool pages | Quiz, vendor click, PDF |
| Comparisons | tirzepatide vs semaglutide, BPC-157 vs TB-500 | Comparison pages | Quiz, PDF, vendor click |
| Best peptide for goal | best peptide for tendon repair, fat loss, sleep, muscle recovery | Goal hubs and articles | Quiz, PDF, vendor click |
| Demographic intent | peptides for runners, men over 40, menopause, bodybuilding | Demographic posts | Quiz, PDF |
| Safety/trust | how to read peptide COA, RUO vs human use, FDA peptide warnings | Guides | Vendor trust, quiz |

### 30/60/90-Day Roadmap

**First 30 days**

- Fix broken goal links from peptide/blog/templates.
- Add page-specific OG/Twitter metadata and missing canonicals.
- Replace placeholder homepage/internal links with specific guide, tool, vendor, and comparison URLs.
- Add analytics events for organic landing page, quiz start, quiz completion, outbound vendor click, PDF checkout start, and purchase.
- Add visible author/reviewer/methodology blocks to peptide, guide, blog, and demographic templates.

**Days 31-60**

- Expand vendor SEO:
  - Add 8-12 vendor profiles.
  - Add "best peptide vendors" sections by COA quality, US shipping, international shipping, budget, and product coverage.
  - Add vendor-vs-vendor pages only where both vendors have enough data.
- Improve comparison pages:
  - Add a unique "which should you research first?" answer block per pair.
  - Add FAQs and structured comparison facts for high-volume pairs.
  - Noindex or omit low-value pair pages until uniqueness is improved.
- Build 10 core commercial/informational articles:
  - best peptides for recovery
  - best peptides for fat loss
  - best peptides for muscle growth
  - BPC-157 and TB-500 stack
  - CJC-1295 and ipamorelin stack
  - how to choose a peptide vendor
  - peptide COA red flags
  - peptide reconstitution mistakes
  - peptide storage mistakes
  - WADA peptide rules for athletes

**Days 61-90**

- Use GSC/GA data to prune and expand:
  - Keep pages with impressions and high conversion support.
  - Improve pages with impressions but low CTR.
  - Noindex generated pages with no impressions, no links, and weak uniqueness.
- Build protocol/PDF revenue bridges from goal hubs and tools.
- Add internal link modules driven by intent:
  - "Calculate this peptide"
  - "Compare with"
  - "Best vendors for"
  - "Read before buying"
  - "Get a personalized plan"
- Add content refresh workflow using real `updatedAt` and review dates.

## Concrete Implementation Recommendations

### Code

- In peptide, blog, and guide templates, stop linking goal chips to `/goals/${goal.id}` unless the goal ID is actually a hub slug. Use `CATEGORY_HUBS` to resolve a matching hub or link to `/peptides?goal=${goal.id}`.
- Add `openGraph` and `twitter` objects in `generateMetadata` for all major dynamic templates. Use page title, description, canonical URL, and page-specific OG image.
- Add `alternates.canonical` to blog, guide, goal, and any indexable dynamic page missing it.
- Add a small SEO test script that fetches the built sitemap and asserts:
  - no noindex prefixes appear,
  - sitemap URLs return non-404,
  - canonical href matches URL for representative templates,
  - dynamic pages do not render root `og:title=PeptidePros` unless homepage.
- Review route caching/static generation for peptide, vendor, and tool pages. If content is static data, prefer static/prerendered behavior over per-request no-store responses.

### Content

- Add a visible editorial trust block:
  - author,
  - reviewer,
  - last reviewed date,
  - evidence methodology,
  - medical disclaimer,
  - primary sources.
- Add source/citation modules to peptide profiles and comparison pages, not just internal data fields.
- Expand vendor page copy with original scoring rationale, COA screenshots/fields, shipping notes, refund policy, product coverage, trust caveats, and affiliate disclosure.
- Build a "PeptidePros methodology" page and link it from vendor rankings, peptide pages, and footer.

### Measurement

- Track these events with source page path and organic landing page:
  - `quiz_start`
  - `quiz_complete`
  - `affiliate_outbound_click`
  - `pdf_checkout_start`
  - `pdf_purchase`
  - `tool_use`
  - `vendor_compare_filter`
- In Search Console, monitor:
  - indexed vs submitted pages,
  - crawled not indexed for generated comparison/tool pages,
  - query CTR for peptide and vendor pages,
  - pages with impressions but no conversion events.

## Validation Performed

- Fetched live `robots.txt`: confirmed public allow, noindex route disallows, apex sitemap, apex host.
- Fetched live sitemap: confirmed 534 URLs.
- Sampled live page headers:
  - `https://peptidepros.io/peptides/bpc-157` returns 200.
  - `https://www.peptidepros.io/peptides/bpc-157` 308 redirects to apex URL.
  - `https://peptidepros.io/goals/recovery` returns 404.
  - `https://peptidepros.io/goals/recovery-injury-support` returns 200.
- Sampled live metadata for:
  - BPC-157 peptide profile.
  - Tirzepatide vs semaglutide blog post.
  - BPC-157 reconstitution tool page.
  - Amino Club vendor page.
- Confirmed representative schema on live pages:
  - Organization.
  - WebSite with SearchAction.
  - BreadcrumbList.
  - Drug on peptide pages.
  - Article/FAQPage on blog pages.
  - SoftwareApplication on tool pages.

## Needs Private Data To Validate

- Which organic landing pages produce quiz starts, vendor clicks, and purchases.
- Which sitemap URLs are indexed vs crawled-not-indexed in Google Search Console.
- Which generated comparison pages get impressions.
- Which terms currently rank in positions 4-20 and can be moved with CTR/title/content improvements.
- Conversion value by route type: peptide profile, demographic page, tool page, comparison page, vendor page, guide.

## Source Notes

- Live crawl files checked: `https://peptidepros.io/robots.txt`, `https://peptidepros.io/sitemap.xml`, `https://peptidepros.io/llms.txt`.
- Representative live pages checked:
  - `https://peptidepros.io/peptides/bpc-157`
  - `https://peptidepros.io/blog/tirzepatide-vs-semaglutide-fat-loss`
  - `https://peptidepros.io/tools/reconstitution/bpc-157`
  - `https://peptidepros.io/vendors/amino-club`
  - `https://peptidepros.io/goals/recovery-injury-support`
- Repo surfaces inspected:
  - `src/app/layout.tsx`
  - `src/app/robots.ts`
  - `src/app/sitemap.ts`
  - `src/app/llms.txt/route.ts`
  - `src/app/peptides/[slug]/page.tsx`
  - `src/app/blog/[slug]/page.tsx`
  - `src/app/vendors/[slug]/page.tsx`
  - `src/app/goals/[slug]/page.tsx`
  - `src/data/goals.ts`
  - `src/data/category-hubs.ts`
