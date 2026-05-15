import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, ShieldAlert, TriangleAlert } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { IntentCtaPanel } from "@/components/marketing/IntentCtaPanel";
import { StickyQuizCta } from "@/components/marketing/StickyQuizCta";
import { EditorialTrustBlock } from "@/components/seo/EditorialTrustBlock";
import { BreadcrumbList } from "@/components/seo/JsonLd";
import { SourceList } from "@/components/seo/SourceList";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getBlogPostById,
  getBlogPostBySlug,
  getBlogCategoryById,
  getPublishedBlogPosts,
  type BlogCalloutType,
} from "@/data/blog";
import { getGoalById } from "@/data/goals";
import { getPeptideById } from "@/data/peptides";
import { buildSeoMetadata } from "@/lib/seo-metadata";
import { getGoalHref } from "@/lib/goal-links";
import { getDefaultArticleReview } from "@/lib/editorial";

const SECTION_CARD =
  "rounded-xl border border-stone-200 bg-white/90 p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)]";
const DETAIL_CELL = "rounded-lg bg-stone-50 border border-stone-100 p-3";
const DETAIL_LABEL =
  "text-[11px] font-semibold uppercase tracking-wider text-[color:var(--primary)] mb-1";

function getCalloutStyles(type: BlogCalloutType) {
  if (type === "danger") return "border-l-red-500 bg-red-500/5";
  if (type === "warning") return "border-l-yellow-500 bg-yellow-500/5";
  if (type === "compliance") return "border-l-blue-500 bg-blue-500/5";
  return "border-l-[color:var(--primary)] bg-[color:var(--primary)]/5";
}

function CalloutIcon({ type }: { type: BlogCalloutType }) {
  if (type === "danger" || type === "warning") {
    return <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600" />;
  }
  return <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--primary)]" />;
}

function HeroChip({
  children,
  tone = "ghost",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "ghost" | "yellow" | "red";
  className?: string;
}) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide";
  const tones: Record<string, string> = {
    ghost: "border-white/20 bg-white/[0.07] text-white/80",
    yellow: "border-yellow-300/50 bg-yellow-300/15 text-yellow-100",
    red: "border-red-400/50 bg-red-400/15 text-red-100",
  };
  return <span className={`${base} ${tones[tone]} ${className}`}>{children}</span>;
}

function StatCell({
  value,
  label,
  capitalize = false,
}: {
  value: string;
  label: string;
  capitalize?: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className={`text-xl font-bold text-white leading-none ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/45">
        {label}
      </div>
    </div>
  );
}

function formatShortDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export async function generateStaticParams() {
  return getPublishedBlogPosts().map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    ...buildSeoMetadata({
      title: post.seoTitle,
      description: post.seoDescription,
      path: `/blog/${post.slug}`,
      imagePath: `/blog/${post.slug}/opengraph-image`,
      imageAlt: `${post.title} blog post`,
      type: "article",
    }),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const category = getBlogCategoryById(post.categoryId);
  const relatedPosts = post.relatedPostIds
    .map((postId) => getBlogPostById(postId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedPeptides = post.relatedPeptideIds
    .map((peptideId) => getPeptideById(peptideId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedGoals = post.relatedGoalIds
    .map((goalId) => getGoalById(goalId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const sectionsStat = String(post.sections.length);
  const faqsStat = String(post.faqs.length);
  const updatedStat = formatShortDate(post.updatedAt);
  const showQuizCta = post.showQuizCta !== false;
  const editorialReview = post.editorialReview ?? getDefaultArticleReview(post.updatedAt);

  // FAQ JSON-LD for rich snippets / AI extraction
  const faqJsonLd = post.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    articleSection: category?.title ?? post.categoryId,
  };

  return (
    <>
      <BreadcrumbList
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <Header />
      <main className="flex-1 bg-stone-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        {faqJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        )}

        {/* ── Hero ────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #103b2c 0%, oklch(0.52 0.11 164) 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "34px 34px",
            }}
          />
          <div className="relative container mx-auto max-w-6xl px-4 sm:px-6 pt-8 pb-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Blog
            </Link>

            <div className="mt-5 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(240px,280px)] md:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/45 mb-3">
                  {post.heroEyebrow}
                </p>
                <h1 className="text-4xl sm:text-5xl font-bold text-white leading-[1.05] tracking-tight">
                  {post.title}
                </h1>
                <p className="mt-3 max-w-[560px] text-sm text-white/65 leading-relaxed">
                  {post.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {category && <HeroChip>{category.title}</HeroChip>}
                  <HeroChip>Updated {updatedStat}</HeroChip>
                </div>
              </div>

              {/* Stats float panel */}
              <div className="rounded-xl border border-white/12 bg-white/[0.07] p-5 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <StatCell value={sectionsStat} label="Sections" />
                  <StatCell value={faqsStat} label="FAQs" />
                  <StatCell value={updatedStat} label="Updated" />
                  <StatCell value={category?.title ?? "—"} label="Pillar" />
                </div>
                <div className="mt-4 flex gap-2 border-t border-white/12 pt-3">
                  <Button
                    size="sm"
                    className="flex-1"
                    render={<Link href="/peptides" />}
                  >
                    Peptides
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                    render={<Link href="/quiz" />}
                  >
                    Quiz
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Two-col body ────────────────────────────────────── */}
        <section className="border-b border-stone-200 bg-stone-50">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-5">
            <EditorialTrustBlock review={editorialReview} />
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 sm:px-6 py-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            {/* ── Main column ── */}
            <div className="flex flex-col gap-5">
              {/* Answer-first lead (pAEO / Position Zero) */}
              <div
                className="rounded-xl border-l-[3px] border-l-[color:var(--primary)] bg-[color:var(--primary)]/5 px-5 py-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--primary)]">
                  Quick answer
                </p>
                <p className="mt-1.5 text-sm text-foreground/85 leading-relaxed">
                  {post.answerFirst}
                </p>
              </div>

              <IntentCtaPanel
                eyebrow="Article next step"
                title="Turn this research into a personalized path."
                body="Use the quiz before moving from education to compound, vendor, or protocol decisions."
                secondaryHref="/guides"
                secondaryLabel="Read more guides"
                tertiaryHref="/vendors"
                tertiaryLabel="Review vendors"
              />

              {/* Why this matters */}
              {post.whyItMatters.length > 0 && (
                <div className={SECTION_CARD}>
                  <h2 className="text-lg font-semibold text-foreground mb-3">Why this matters</h2>
                  <div className="space-y-3">
                    {post.whyItMatters.map((item) => (
                      <p key={item} className="text-sm text-muted-foreground leading-relaxed">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Key takeaways */}
              {post.keyTakeaways.length > 0 && (
                <div className={SECTION_CARD}>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Key takeaways</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {post.keyTakeaways.map((takeaway, i) => (
                      <div key={takeaway} className={DETAIL_CELL}>
                        <div className={DETAIL_LABEL}>Takeaway {i + 1}</div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{takeaway}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sections */}
              {post.sections.map((section) => (
                <div key={section.id} className={SECTION_CARD}>
                  <h2 className="text-lg font-semibold text-foreground mb-3">{section.title}</h2>
                  <div className="space-y-4">
                    {section.intro && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{section.intro}</p>
                    )}

                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph} className="text-sm text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}

                    {section.bullets && (
                      <div className="grid gap-2">
                        {section.bullets.map((bullet) => (
                          <div key={bullet} className={`${DETAIL_CELL} text-sm text-foreground/80`}>
                            {bullet}
                          </div>
                        ))}
                      </div>
                    )}

                    {section.checklist && (
                      <div className="grid gap-2">
                        {section.checklist.map((item) => (
                          <div
                            key={item}
                            className="flex items-start gap-3 rounded-lg border border-stone-200 bg-white p-3"
                          >
                            <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--primary)]" />
                            <p className="text-sm text-foreground/80 leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.table && (
                      <div className="overflow-x-auto rounded-lg border border-stone-200">
                        <Table>
                          {section.table.caption && (
                            <TableCaption>{section.table.caption}</TableCaption>
                          )}
                          <TableHeader>
                            <TableRow>
                              {section.table.columns.map((column) => (
                                <TableHead key={column}>{column}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {section.table.rows.map((row) => (
                              <TableRow key={row.join("-")}>
                                {row.map((cell) => (
                                  <TableCell
                                    key={cell}
                                    className="whitespace-normal text-sm text-muted-foreground"
                                  >
                                    {cell}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}

                    {section.callout && (
                      <div
                        className={`flex items-start gap-3 rounded-md border-l-[3px] p-3 ${getCalloutStyles(
                          section.callout.type
                        )}`}
                      >
                        <CalloutIcon type={section.callout.type} />
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {section.callout.title}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                            {section.callout.body}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* FAQs */}
              {post.faqs.length > 0 && (
                <div className={SECTION_CARD}>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Frequently asked questions
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {post.faqs.map((faq) => (
                      <div key={faq.question} className={DETAIL_CELL}>
                        <div className={DETAIL_LABEL}>{faq.question}</div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inline quiz CTA */}
              {showQuizCta && (
                <div
                  className="flex flex-col gap-3 rounded-xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  style={{
                    borderColor: "oklch(0.52 0.11 164 / 0.2)",
                    background: "oklch(0.52 0.11 164 / 0.05)",
                  }}
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Want this matched to your goals?
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      6 questions, 2 minutes. Free.
                    </p>
                  </div>
                  <Button render={<Link href="/quiz" />}>
                    Take the Quiz <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>

            {/* ── Sticky right rail ── */}
            <aside className="flex flex-col gap-4 lg:sticky lg:top-20">
              {showQuizCta && <StickyQuizCta />}

              {/* Related Peptides */}
              {relatedPeptides.length > 0 && (
                <div className={SECTION_CARD.replace("p-6", "p-5")}>
                  <h3 className="text-base font-semibold text-foreground mb-3">Related peptides</h3>
                  <div className="divide-y divide-stone-100">
                    {relatedPeptides.map((peptide) => (
                      <div
                        key={peptide.id}
                        className="flex items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {peptide.name}
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            Tier {peptide.evidenceTier} · {peptide.riskLevel.replace("-", "–")} risk
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="shrink-0 h-7 px-2.5 text-xs"
                          render={<Link href={`/peptides/${peptide.slug}`} />}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Goals */}
              {relatedGoals.length > 0 && (
                <div className={SECTION_CARD.replace("p-6", "p-5")}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Related goals
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {relatedGoals.map((goal) => (
                      <Link
                        key={goal.id}
                        href={getGoalHref(goal.id)}
                        className="inline-flex rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-foreground hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] transition-colors"
                      >
                        {goal.displayName}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Read next / Related posts */}
              {relatedPosts.length > 0 && (
                <div
                  className="rounded-xl border p-5"
                  style={{
                    borderColor: "oklch(0.52 0.11 164 / 0.2)",
                    background: "oklch(0.52 0.11 164 / 0.05)",
                  }}
                >
                  <p className="text-sm font-semibold text-[color:var(--primary)] mb-1">
                    Read next
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {relatedPosts.map((relatedPost) => (
                      <li key={relatedPost.id}>
                        <Link
                          href={`/blog/${relatedPost.slug}`}
                          className="group flex items-start gap-1.5 text-xs text-foreground/90 hover:text-[color:var(--primary)]"
                        >
                          <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--primary)]/60" />
                          <span className="underline decoration-transparent group-hover:decoration-current underline-offset-2">
                            {relatedPost.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>

          <div className="mx-auto mt-8 max-w-3xl">
            <SourceList sources={editorialReview.sources} />
          </div>

          {/* Footer CTA */}
          <div className="mx-auto mt-12 max-w-3xl text-center">
            <p className="text-sm text-muted-foreground">
              Use this breakdown to research smarter — then compare compounds, review vendor documentation, and take the quiz when you&rsquo;re ready for a plan.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button render={<Link href="/peptides" />}>
                Browse compounds <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" render={<Link href="/quiz" />}>
                Build your plan
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
