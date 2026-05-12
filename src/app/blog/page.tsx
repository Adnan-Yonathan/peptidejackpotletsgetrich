import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import {
  getBlogCategoryById,
  getPublishedBlogPosts,
  type BlogPostData,
} from "@/data/blog";
import {
  getPublishedDemographicPages,
  type DemographicCluster,
  type DemographicPageData,
} from "@/data/demographic-pages";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Evidence-graded peptide guides matched to age, sex, condition, and lifestyle. Plus head-to-head compound comparisons.",
};

type ArticleCard = {
  kind: "blog" | "demographic";
  id: string;
  href: string;
  label: string;
  kicker: string;
  readMinutes: number;
  title: string;
  summary: string;
  publishedAt: string;
};

const CLUSTER_BANDS: { id: DemographicCluster; title: string; lede: string }[] = [
  {
    id: "age-gender",
    title: "By age & sex",
    lede: "The decade you're in changes which peptides have evidence behind them — and which are overkill.",
  },
  {
    id: "life-stage",
    title: "By life stage",
    lede: "Hormonal transitions reshape the protocol. Perimenopause, postpartum, low-T, and beyond.",
  },
  {
    id: "condition",
    title: "By condition",
    lede: "Where peptides become first-line, not adjunct. PCOS, diabetes, obesity, insulin resistance.",
  },
  {
    id: "athlete",
    title: "By training",
    lede: "Sport-specific recovery, hypertrophy, and compliance with tested federations.",
  },
  {
    id: "aesthetic",
    title: "Aesthetic",
    lede: "Skin, body composition, and the looksmaxxing protocols that actually have mechanisms.",
  },
  {
    id: "lifestyle",
    title: "By lifestyle",
    lede: "Students, founders, shift workers, military, veterans, and biohackers — protocols built for how you actually live.",
  },
];

function getReadTime(post: BlogPostData) {
  const sectionWeight = post.sections.length * 0.6;
  const faqWeight = post.faqs.length * 0.3;
  const takeawayWeight = post.keyTakeaways.length * 0.2;
  return Math.max(3, Math.round(sectionWeight + faqWeight + takeawayWeight));
}

function blogPostToCard(post: BlogPostData): ArticleCard {
  return {
    kind: "blog",
    id: post.id,
    href: `/blog/${post.slug}`,
    label: getBlogCategoryById(post.categoryId)?.title ?? post.categoryId,
    kicker: "Comparison",
    readMinutes: getReadTime(post),
    title: post.title,
    summary: post.summary,
    publishedAt: post.publishedAt,
  };
}

function demographicToCard(p: DemographicPageData): ArticleCard {
  return {
    kind: "demographic",
    id: p.id,
    href: `/blog/peptides-for/${p.slug}`,
    label: p.audience,
    kicker: clusterKicker(p.cluster),
    readMinutes: p.readMinutes,
    title: p.h1,
    summary: p.heroSummary,
    publishedAt: p.publishedAt,
  };
}

function clusterKicker(cluster: DemographicCluster): string {
  switch (cluster) {
    case "age-gender":     return "Age guide";
    case "life-stage":     return "Life-stage";
    case "condition":      return "Condition";
    case "athlete":        return "Training";
    case "aesthetic":      return "Aesthetic";
    case "lifestyle":      return "Lifestyle";
    default:               return "Guide";
  }
}

function formatDateMono(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d
    .toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

export default function BlogIndexPage() {
  const blogPosts = getPublishedBlogPosts();
  const demographicPages = getPublishedDemographicPages();
  const totalArticles = blogPosts.length + demographicPages.length;

  // Lead piece — most recently updated demographic page, or fall back to a blog post
  const allDemographicCards = demographicPages.map(demographicToCard);
  const blogCards = blogPosts.map(blogPostToCard);
  const leadCard: ArticleCard | undefined =
    allDemographicCards[0] ?? blogCards[0];

  // Group demographic cards by cluster for the section bands
  const byCluster = new Map<DemographicCluster, ArticleCard[]>();
  demographicPages.forEach((p) => {
    const list = byCluster.get(p.cluster) ?? [];
    list.push(demographicToCard(p));
    byCluster.set(p.cluster, list);
  });

  return (
    <>
      <Header />
      <main className="bg-[#fbfaf7] text-[#103b2c]">
        {/* ═══ Editorial masthead ════════════════════════════════════════ */}
        <header className="relative overflow-hidden border-b-2 border-[#103b2c] bg-[#fbfaf7]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #103b2c 1px, transparent 1px), linear-gradient(to bottom, #103b2c 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="relative container mx-auto max-w-6xl px-4 pt-10 pb-10 md:pt-14 md:pb-14">
            {/* Top strip */}
            <div className="flex flex-wrap items-center justify-between gap-y-2 border-b border-[#103b2c]/15 pb-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#103b2c]/55">
              <span className="text-[#0f6a52]">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-[#0f6a52]" />
                The Brief — Independent Peptide Research
              </span>
              <span>Vol. 01 · {totalArticles} pieces in circulation</span>
            </div>

            {/* Masthead title */}
            <div className="mt-6 grid items-end gap-6 md:grid-cols-[minmax(0,1fr)_auto]">
              <h1 className="font-extrabold leading-[0.92] tracking-[-0.04em] text-[64px] sm:text-[88px] md:text-[112px]">
                The{" "}
                <span className="relative inline-block italic text-[#0f6a52]">
                  <span className="relative z-10">Brief</span>
                  <span
                    aria-hidden
                    className="absolute -bottom-2 left-0 h-[10px] w-full bg-[#0f6a52]/15"
                  />
                </span>
                .
              </h1>
              <p className="max-w-[360px] text-[14.5px] leading-[1.6] text-[#103b2c]/65 md:text-right">
                Evidence-graded peptide guides — matched to age, sex, condition, and
                lifestyle. Plus head-to-head compound comparisons.
              </p>
            </div>
          </div>
        </header>

        {/* ═══ Lead story ═════════════════════════════════════════════════ */}
        {leadCard && (
          <section className="border-b border-[#103b2c]/15 bg-white">
            <div className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
              <p className="mb-6 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#0f6a52]">
                <span className="font-bold">§01</span> · Lead piece
              </p>
              <Link
                href={leadCard.href}
                className="group grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-end"
              >
                <div>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#103b2c]/55">
                    {leadCard.kicker} · {leadCard.label} · {leadCard.readMinutes} min
                  </p>
                  <h2 className="mt-3 font-extrabold leading-[1.02] tracking-[-0.03em] text-[36px] sm:text-[48px] md:text-[60px] text-[#103b2c] transition-colors group-hover:text-[#0f6a52]">
                    {leadCard.title}
                  </h2>
                  <p className="mt-5 max-w-[600px] text-[15.5px] leading-[1.65] text-[#103b2c]/70 md:text-[16.5px]">
                    {leadCard.summary}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 border-b-2 border-[#0f6a52] pb-0.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#103b2c] transition-colors group-hover:text-[#0f6a52]">
                    Read the brief
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                  </span>
                </div>
                <div className="border-l border-[#103b2c]/15 pl-6 md:self-end">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/45">
                    Filed
                  </p>
                  <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.14em] text-[#103b2c]">
                    {formatDateMono(leadCard.publishedAt)}
                  </p>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* ═══ Section nav — anchor jumps to each cluster band ═══════════ */}
        <nav
          aria-label="Sections"
          className="sticky top-16 z-30 border-b border-[#103b2c]/15 bg-[#fbfaf7]/95 backdrop-blur supports-[backdrop-filter]:bg-[#fbfaf7]/80"
        >
          <div className="container mx-auto max-w-6xl px-4">
            <ol className="flex items-center gap-x-6 gap-y-1 overflow-x-auto whitespace-nowrap py-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#103b2c]/55">
              <li className="text-[#103b2c]">Sections —</li>
              {CLUSTER_BANDS.map((band) => {
                const count = byCluster.get(band.id)?.length ?? 0;
                if (count === 0) return null;
                return (
                  <li key={band.id}>
                    <a
                      href={`#${band.id}`}
                      className="transition-colors hover:text-[#0f6a52]"
                    >
                      {band.title}{" "}
                      <span className="text-[#0f6a52]/70">({count})</span>
                    </a>
                  </li>
                );
              })}
              {blogCards.length > 0 && (
                <li>
                  <a
                    href="#comparisons"
                    className="transition-colors hover:text-[#0f6a52]"
                  >
                    Comparisons{" "}
                    <span className="text-[#0f6a52]/70">({blogCards.length})</span>
                  </a>
                </li>
              )}
            </ol>
          </div>
        </nav>

        {/* ═══ Section bands — one per cluster ═══════════════════════════ */}
        {CLUSTER_BANDS.map((band, bandIndex) => {
          const cards = byCluster.get(band.id);
          if (!cards || cards.length === 0) return null;
          const isAlt = bandIndex % 2 === 1;
          return (
            <section
              key={band.id}
              id={band.id}
              className={`scroll-mt-32 ${isAlt ? "bg-white" : "bg-[#fbfaf7]"}`}
            >
              <div className="container mx-auto max-w-6xl px-4 py-14 md:py-20">
                {/* Band header */}
                <header className="mb-10 grid items-end gap-6 border-b border-[#103b2c]/15 pb-6 md:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
                  <div>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#0f6a52]">
                      §{String(bandIndex + 2).padStart(2, "0")}
                    </p>
                    <h2 className="mt-2 text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#103b2c] md:text-[44px]">
                      {band.title}
                    </h2>
                  </div>
                  <p className="text-[14.5px] leading-[1.6] text-[#103b2c]/65 md:text-right">
                    {band.lede}
                  </p>
                </header>

                {/* Card grid — pillar-style separator lines */}
                <ol className="grid gap-px bg-[#103b2c]/10 md:grid-cols-2 lg:grid-cols-3">
                  {cards.map((card, i) => (
                    <ArticleTile key={card.id} card={card} index={i + 1} alt={isAlt} />
                  ))}
                </ol>
              </div>
            </section>
          );
        })}

        {/* ═══ Comparisons band ══════════════════════════════════════════ */}
        {blogCards.length > 0 && (
          <section
            id="comparisons"
            className="scroll-mt-32 border-t border-[#103b2c]/15 bg-[#fbfaf7]"
          >
            <div className="container mx-auto max-w-6xl px-4 py-14 md:py-20">
              <header className="mb-10 grid items-end gap-6 border-b border-[#103b2c]/15 pb-6 md:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
                <div>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-[#0f6a52]">
                    §{String(CLUSTER_BANDS.length + 2).padStart(2, "0")}
                  </p>
                  <h2 className="mt-2 text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#103b2c] md:text-[44px]">
                    Head-to-head comparisons
                  </h2>
                </div>
                <p className="text-[14.5px] leading-[1.6] text-[#103b2c]/65 md:text-right">
                  Compound vs. compound and stack vs. stack breakdowns. Same evidence
                  rubric as every guide.
                </p>
              </header>
              <ol className="grid gap-px bg-[#103b2c]/10 md:grid-cols-2 lg:grid-cols-3">
                {blogCards.map((card, i) => (
                  <ArticleTile key={card.id} card={card} index={i + 1} alt={false} />
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* ═══ Footer CTA ════════════════════════════════════════════════ */}
        <section
          aria-label="Custom protocol"
          className="relative overflow-hidden bg-[#0c3226] text-white"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #4ade80 1px, transparent 1px), linear-gradient(to bottom, #4ade80 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
          <div className="relative container mx-auto max-w-6xl px-4 py-20 md:py-28">
            <div className="grid items-end gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">
                  <span className="text-[#4ade80]">§</span> Custom protocol
                </p>
                <h2 className="mt-4 font-extrabold leading-[0.98] tracking-[-0.035em] text-[44px] sm:text-[60px] md:text-[76px]">
                  Skip the{" "}
                  <span className="italic text-[#4ade80]">reading</span>.
                </h2>
                <p className="mt-5 max-w-[520px] text-[15.5px] leading-[1.65] text-white/70">
                  Six questions match compounds, dosing, stacking, and timing to your
                  goals, age, sex, and risk tolerance. Built in two minutes. Free.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 md:items-end">
                <Link
                  href="/quiz"
                  className="inline-flex h-[56px] items-center gap-2 bg-white px-7 text-[14.5px] font-extrabold uppercase tracking-[0.04em] text-[#103b2c] transition-transform hover:-translate-y-0.5"
                >
                  Build my protocol
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </Link>
                <Link
                  href="/peptides"
                  className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.18em] text-white/75 transition-colors hover:text-[#4ade80]"
                >
                  Or browse all peptides
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Article tile — broadsheet card with numeric prefix + meta strip + summary
// ──────────────────────────────────────────────────────────────────────
function ArticleTile({
  card,
  index,
  alt,
}: {
  card: ArticleCard;
  index: number;
  alt: boolean;
}) {
  return (
    <li>
      <Link
        href={card.href}
        className={`group flex h-full flex-col ${
          alt ? "bg-white hover:bg-[#fbfaf7]" : "bg-[#fbfaf7] hover:bg-white"
        } p-6 transition-colors md:p-7`}
      >
        {/* Numeric + kicker row */}
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#0f6a52]">
            {String(index).padStart(2, "0")} · {card.kicker}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#103b2c]/45">
            {card.readMinutes} min
          </span>
        </div>

        {/* Audience / category label */}
        <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#103b2c]/55">
          {card.label}
        </p>

        {/* Title */}
        <h3 className="mt-2 text-[20px] font-bold leading-[1.2] tracking-[-0.015em] text-[#103b2c] transition-colors group-hover:text-[#0f6a52]">
          {card.title}
        </h3>

        {/* Summary */}
        <p className="mt-3 flex-1 text-[13.5px] leading-[1.6] text-[#103b2c]/65">
          {card.summary}
        </p>

        {/* Footer row */}
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#103b2c]/10 pt-3">
          <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[#103b2c] transition-colors group-hover:text-[#0f6a52]">
            Read
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
          </span>
          <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#103b2c]/40">
            {formatDateMono(card.publishedAt)}
          </span>
        </div>
      </Link>
    </li>
  );
}
