import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, ShieldAlert, TriangleAlert } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
  getGuideById,
  getGuideBySlug,
  getGuideCategoryById,
  getPublishedGuides,
  type GuideCalloutType,
} from "@/data/guides";
import { getGoalById } from "@/data/goals";
import { getPeptideById } from "@/data/peptides";

const SECTION_CARD =
  "rounded-xl border border-stone-200 bg-white/90 p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)]";
const DETAIL_CELL = "rounded-lg bg-stone-50 border border-stone-100 p-3";
const DETAIL_LABEL =
  "text-[11px] font-semibold uppercase tracking-wider text-[color:var(--primary)] mb-1";

function getCalloutStyles(type: GuideCalloutType) {
  if (type === "danger") return "border-l-red-500 bg-red-500/5";
  if (type === "warning") return "border-l-yellow-500 bg-yellow-500/5";
  if (type === "compliance") return "border-l-blue-500 bg-blue-500/5";
  return "border-l-[color:var(--primary)] bg-[color:var(--primary)]/5";
}

function CalloutIcon({ type }: { type: GuideCalloutType }) {
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
  return getPublishedGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return { title: "Guide Not Found" };
  }

  return {
    title: guide.seoTitle,
    description: guide.seoDescription,
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const category = getGuideCategoryById(guide.categoryId);
  const relatedGuides = guide.relatedGuideIds
    .map((guideId) => getGuideById(guideId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedPeptides = guide.relatedPeptideIds
    .map((peptideId) => getPeptideById(peptideId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedGoals = guide.relatedGoalIds
    .map((goalId) => getGoalById(goalId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const difficultyStat = guide.difficulty.charAt(0).toUpperCase() + guide.difficulty.slice(1, 4) + ".";
  const sectionsStat = String(guide.sections.length);
  const faqsStat = String(guide.faqs.length);
  const updatedStat = formatShortDate(guide.updatedAt);

  return (
    <>
      <Header />
      <main className="flex-1 bg-stone-50">
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
              href="/guides"
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All Guides
            </Link>

            <div className="mt-5 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(240px,280px)] md:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/45 mb-3">
                  {guide.heroEyebrow}
                </p>
                <h1 className="text-4xl sm:text-5xl font-bold text-white leading-[1.05] tracking-tight">
                  {guide.title}
                </h1>
                <p className="mt-3 max-w-[560px] text-sm text-white/65 leading-relaxed">
                  {guide.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  <HeroChip className="capitalize">{guide.difficulty}</HeroChip>
                  {category && <HeroChip>{category.title}</HeroChip>}
                  <HeroChip>Updated {updatedStat}</HeroChip>
                </div>
              </div>

              {/* Stats float panel */}
              <div className="rounded-xl border border-white/12 bg-white/[0.07] p-5 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4">
                  <StatCell value={difficultyStat} label="Level" />
                  <StatCell value={sectionsStat} label="Sections" />
                  <StatCell value={faqsStat} label="FAQs" />
                  <StatCell value={updatedStat} label="Updated" />
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
        <section className="container mx-auto max-w-6xl px-4 sm:px-6 py-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            {/* ── Main column ── */}
            <div className="flex flex-col gap-5">
              {/* Why this matters */}
              {guide.whyItMatters.length > 0 && (
                <div className={SECTION_CARD}>
                  <h2 className="text-lg font-semibold text-foreground mb-3">Why this matters</h2>
                  <div className="space-y-3">
                    {guide.whyItMatters.map((item) => (
                      <p key={item} className="text-sm text-muted-foreground leading-relaxed">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Key takeaways */}
              {guide.keyTakeaways.length > 0 && (
                <div className={SECTION_CARD}>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Key takeaways</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {guide.keyTakeaways.map((takeaway, i) => (
                      <div key={takeaway} className={DETAIL_CELL}>
                        <div className={DETAIL_LABEL}>Takeaway {i + 1}</div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{takeaway}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sections */}
              {guide.sections.map((section) => (
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
              {guide.faqs.length > 0 && (
                <div className={SECTION_CARD}>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Frequently asked questions
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {guide.faqs.map((faq) => (
                      <div key={faq.question} className={DETAIL_CELL}>
                        <div className={DETAIL_LABEL}>{faq.question}</div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Sticky right rail ── */}
            <aside className="flex flex-col gap-4 lg:sticky lg:top-20">
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
                        href={`/goals/${goal.id}`}
                        className="inline-flex rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs text-foreground hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] transition-colors"
                      >
                        {goal.displayName}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Read next / Related guides */}
              {relatedGuides.length > 0 && (
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
                  <p className="text-xs text-muted-foreground mb-3">
                    Deeper cuts on adjacent topics — follow these to fill in gaps this guide
                    didn&apos;t cover.
                  </p>
                  <ul className="space-y-1.5">
                    {relatedGuides.map((relatedGuide) => (
                      <li key={relatedGuide.id}>
                        <Link
                          href={`/guides/${relatedGuide.slug}`}
                          className="group flex items-start gap-1.5 text-xs text-foreground/90 hover:text-[color:var(--primary)]"
                        >
                          <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--primary)]/60" />
                          <span className="underline decoration-transparent group-hover:decoration-current underline-offset-2">
                            {relatedGuide.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>

          {/* Footer CTA */}
          <div className="mx-auto mt-12 max-w-3xl text-center">
            <p className="text-sm text-muted-foreground">
              Use these guides to build confidence first — then compare compounds, review vendor
              documentation, and take the quiz when you&apos;re ready for a plan.
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
