import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { IntentCtaPanel } from "@/components/marketing/IntentCtaPanel";
import { StickyQuizCta } from "@/components/marketing/StickyQuizCta";
import { DemographicJsonLd } from "@/components/seo/DemographicJsonLd";
import { EditorialTrustBlock } from "@/components/seo/EditorialTrustBlock";
import { SourceList } from "@/components/seo/SourceList";
import {
  DEMOGRAPHIC_AUTHORS,
  derivePeptideRecs,
  riskColor,
  tierColor,
  type DemographicPageData,
  type DemographicSafetyFlag,
  type DerivedPeptideRec,
} from "@/data/demographic-pages";
import { getDefaultArticleReview } from "@/lib/editorial";

type GscUpgrade = {
  answer: string;
  forText: string;
  avoidText: string;
  situations: Array<{ situation: string; compound: string; href: string; reason: string }>;
  links: Array<{ label: string; href: string }>;
};

const GSC_DEMOGRAPHIC_UPGRADES: Record<string, GscUpgrade> = {
  "men-in-their-20s": {
    answer: "For men in their 20s, peptides should be narrow and problem-led, not a default enhancement stack. The strongest research cases are injury recovery, sleep disruption, and short-term body-composition support when training, diet, and medical basics are already handled.",
    forText: "Best fit: active men with a clear bottleneck such as tendon irritation, recovery lag, poor sleep, or a documented cut-phase need.",
    avoidText: "Avoid if the goal is vague anti-aging, replacing disciplined training, or experimenting with GH-axis compounds before basic labs and lifestyle are stable.",
    situations: [
      { situation: "Tendon flare", compound: "BPC-157", href: "/peptides/bpc-157", reason: "Most direct recovery intent." },
      { situation: "Training recovery", compound: "TB-500", href: "/peptides/tb-500", reason: "Pairs with tissue-repair research." },
      { situation: "Cut phase", compound: "Semaglutide", href: "/peptides/semaglutide", reason: "Only when weight-loss indication is real." },
    ],
    links: [
      { label: "Recovery hub", href: "/goals/recovery-injury-support" },
      { label: "BPC-157 vs TB-500", href: "/compare/peptides/bpc-157-vs-tb-500" },
      { label: "Find my plan", href: "/quiz" },
      { label: "Vendor comparison", href: "/vendors" },
    ],
  },
  "men-over-40": {
    answer: "For men over 40, the best peptide research starts with metabolic health, recovery capacity, sleep, and verified hormone status. The right first compound depends on whether the dominant problem is fat gain, injury recovery, or low-energy recovery despite adequate training.",
    forText: "Best fit: men with measurable changes in waist size, recovery time, sleep quality, labs, or injury frequency.",
    avoidText: "Avoid using peptides as a substitute for TRT evaluation, cardiovascular risk screening, or clinician-led weight-loss care.",
    situations: [
      { situation: "Metabolic weight gain", compound: "Tirzepatide", href: "/peptides/tirzepatide", reason: "Most direct incretin-class path." },
      { situation: "Recovery bottleneck", compound: "BPC-157", href: "/peptides/bpc-157", reason: "Focused tissue-repair research." },
      { situation: "GH-axis question", compound: "Ipamorelin", href: "/peptides/ipamorelin", reason: "Relevant secretagogue comparison." },
    ],
    links: [
      { label: "Weight loss hub", href: "/goals/weight-loss-metabolism" },
      { label: "Ipamorelin vs Tirzepatide", href: "/compare/peptides/ipamorelin-vs-tirzepatide" },
      { label: "Protocol quiz", href: "/quiz" },
      { label: "Protocol PDFs", href: "/pdfs" },
    ],
  },
  "women-in-their-30s": {
    answer: "For women in their 30s, peptide decisions should be cycle-aware and fertility-aware. The strongest research paths are postpartum recovery after weaning, PCOS or insulin-resistance support with clinician input, skin and collagen support, and injury recovery.",
    forText: "Best fit: women with a defined goal and context, such as PCOS, post-weaning recovery, skin changes, or training-related soft-tissue issues.",
    avoidText: "Avoid during pregnancy, breastfeeding, active conception attempts, or when a symptom needs OB/GYN or endocrinology evaluation first.",
    situations: [
      { situation: "PCOS or insulin resistance", compound: "Semaglutide", href: "/peptides/semaglutide", reason: "Metabolic pathway with clinical context." },
      { situation: "Skin support", compound: "GHK-Cu", href: "/peptides/ghk-cu", reason: "Most relevant cosmetic-support profile." },
      { situation: "Post-weaning recovery", compound: "BPC-157", href: "/peptides/bpc-157", reason: "Recovery-focused research path." },
    ],
    links: [
      { label: "Peptides for PCOS", href: "/blog/peptides-for/pcos" },
      { label: "Postpartum guide", href: "/blog/peptides-for/postpartum" },
      { label: "Take the quiz", href: "/quiz" },
      { label: "Review vendors", href: "/vendors" },
    ],
  },
  "women-over-40": {
    answer: "For women over 40, peptide research should be read through the perimenopause window: changing sleep, body composition, skin thickness, recovery, and insulin sensitivity. The best first choice depends on whether the main issue is metabolic, skin-related, sleep-related, or recovery-related.",
    forText: "Best fit: women tracking perimenopause symptoms, body-composition changes, skin changes, sleep quality, or recovery declines.",
    avoidText: "Avoid using peptides as a replacement for menopause care, HRT evaluation, metabolic labs, or clinician-led treatment for hot flashes and heavy bleeding.",
    situations: [
      { situation: "Midsection fat gain", compound: "Tirzepatide", href: "/peptides/tirzepatide", reason: "Metabolic support when clinically appropriate." },
      { situation: "Skin thinning", compound: "GHK-Cu", href: "/peptides/ghk-cu", reason: "Most direct skin-support profile." },
      { situation: "Sleep disruption", compound: "DSIP", href: "/peptides/dsip", reason: "Sleep-architecture research angle." },
    ],
    links: [
      { label: "Perimenopause guide", href: "/blog/peptides-for/perimenopause" },
      { label: "Menopause guide", href: "/blog/peptides-for/menopause" },
      { label: "Weight loss hub", href: "/goals/weight-loss-metabolism" },
      { label: "Get a personalized plan", href: "/quiz" },
    ],
  },
  menopause: {
    answer: "For menopause, peptides are secondary tools, not replacements for menopause care. The most defensible research angles are sleep architecture, skin and collagen support, body composition, and recovery after the hormonal baseline has stabilized.",
    forText: "Best fit: postmenopausal women with a stable clinical plan who still have a specific unresolved goal such as sleep, skin, body composition, or recovery.",
    avoidText: "Avoid positioning peptides as HRT alternatives or using them before bone-density, cardiovascular, and metabolic screening questions are addressed.",
    situations: [
      { situation: "Sleep quality", compound: "DSIP", href: "/peptides/dsip", reason: "Sleep-support research angle." },
      { situation: "Skin and collagen", compound: "GHK-Cu", href: "/peptides/ghk-cu", reason: "Best fit for skin-support intent." },
      { situation: "Body composition", compound: "Semaglutide", href: "/peptides/semaglutide", reason: "Metabolic support when appropriate." },
    ],
    links: [
      { label: "Women over 40", href: "/blog/peptides-for/women-over-40" },
      { label: "Perimenopause guide", href: "/blog/peptides-for/perimenopause" },
      { label: "Take the quiz", href: "/quiz" },
      { label: "Protocol PDFs", href: "/pdfs" },
    ],
  },
  postpartum: {
    answer: "Postpartum peptide research should wait until clinical clearance and, by default, until breastfeeding has ended. The strongest post-weaning research cases are tissue recovery, skin changes, hair/skin support, anxiety support, and weight-loss support only when clinically appropriate.",
    forText: "Best fit: post-weaning women with a specific recovery issue, such as abdominal wall rehab, soft-tissue discomfort, stretch-mark or skin concerns, or persistent metabolic changes.",
    avoidText: "Avoid during breastfeeding, pregnancy, active complications, postpartum depression without clinical care, or before the six-week postpartum check.",
    situations: [
      { situation: "Soft-tissue recovery", compound: "BPC-157", href: "/peptides/bpc-157", reason: "Most direct recovery profile." },
      { situation: "Skin support", compound: "GHK-Cu", href: "/peptides/ghk-cu", reason: "Skin-support pathway." },
      { situation: "Post-weaning weight loss", compound: "Semaglutide", href: "/peptides/semaglutide", reason: "Only after clinician review." },
    ],
    links: [
      { label: "Women in their 30s", href: "/blog/peptides-for/women-in-their-30s" },
      { label: "PCOS guide", href: "/blog/peptides-for/pcos" },
      { label: "Recovery hub", href: "/goals/recovery-injury-support" },
      { label: "Start the quiz", href: "/quiz" },
    ],
  },
  pcos: {
    answer: "For PCOS, peptide research should start with metabolic and reproductive context, not cosmetic symptom chasing. GLP-1-class compounds are the highest-relevance peptide-adjacent path when insulin resistance or obesity is present, while skin and inflammation goals are secondary.",
    forText: "Best fit: women with PCOS who have weight, insulin-resistance, metabolic, or skin concerns already being managed with a clinician.",
    avoidText: "Avoid during pregnancy attempts without medical guidance, and do not treat peptides as a PCOS cure or replacement for metformin, lifestyle, or endocrine care.",
    situations: [
      { situation: "Insulin resistance", compound: "Semaglutide", href: "/peptides/semaglutide", reason: "Clinically relevant metabolic pathway." },
      { situation: "Higher weight-loss need", compound: "Tirzepatide", href: "/peptides/tirzepatide", reason: "Stronger incretin-class comparison." },
      { situation: "Skin and acne support", compound: "GHK-Cu", href: "/peptides/ghk-cu", reason: "Adjunct skin-support angle." },
    ],
    links: [
      { label: "Insulin resistance guide", href: "/blog/peptides-for/insulin-resistance" },
      { label: "Women in their 30s", href: "/blog/peptides-for/women-in-their-30s" },
      { label: "Tirzepatide vs Semaglutide", href: "/blog/tirzepatide-vs-semaglutide-fat-loss" },
      { label: "Take the quiz", href: "/quiz" },
    ],
  },
};

/**
 * Editorial-broadsheet template for /blog/peptides-for/[slug].
 *
 * Compound recommendations are DERIVED at render time. Editorial never picks
 * the peptides — only the priorityGoals that route the demographic to them.
 *
 * Aesthetic direction: clinical-editorial. Forest-green palette preserved
 * end-to-end. Visual rhythm comes from typography, numbered sections (§01),
 * stock-ticker tier badges, and alternating cream/white bands.
 */
export function DemographicPostTemplate({ page }: { page: DemographicPageData }) {
  const author = DEMOGRAPHIC_AUTHORS[page.authorId];
  const recs = derivePeptideRecs(page);
  const editorialReview = page.editorialReview ?? getDefaultArticleReview(page.updatedAt);
  const gscUpgrade = GSC_DEMOGRAPHIC_UPGRADES[page.slug];

  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: page.h1, href: page.canonicalPath },
  ];

  // Build the ordered, numbered TOC. § prefix is added at render.
  const sections = [
    { id: "tldr", label: "Quick answer" },
    { id: "why-different", label: "Why this group is different" },
    {
      id: "compounds",
      label: recs.length === 1 ? "The one compound" : `The ${recs.length}-compound starter set`,
    },
    ...page.bodySections.map((s) => ({ id: s.id, label: s.title })),
    ...(page.faqs.length ? [{ id: "faq", label: "Frequently asked questions" }] : []),
    { id: "protocol", label: "Get your custom protocol" },
    { id: "siblings", label: "More from this section" },
  ];

  // Ticker-tape eyebrow: goal names joined by middle-dots
  const goalsTicker = page.priorityGoals
    .map((g) => formatGoalLabel(g.goalId))
    .join(" · ");

  return (
    <>
      <DemographicJsonLd page={page} breadcrumbs={breadcrumbs} />
      <Header />

      <main className="bg-[#fbfaf7] text-[#103b2c]">
        <article>
          {/* ═══ Breadcrumb rail ════════════════════════════════════════ */}
          <nav aria-label="Breadcrumb" className="border-b border-[#103b2c]/8 bg-[#fbfaf7]">
            <div className="container mx-auto max-w-6xl px-4 py-3">
              <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#103b2c]/55">
                {breadcrumbs.map((b, i) => (
                  <li key={b.href} className="flex items-center gap-1.5">
                    {i > 0 && <ChevronRight className="h-3 w-3" />}
                    {i === breadcrumbs.length - 1 ? (
                      <span aria-current="page" className="text-[#103b2c]">
                        {b.name}
                      </span>
                    ) : (
                      <Link href={b.href} className="transition-colors hover:text-[#0f6a52]">
                        {b.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          {/* ═══ Editorial masthead ═════════════════════════════════════ */}
          <header className="relative overflow-hidden border-b border-[#103b2c]/10 bg-[#fbfaf7]">
            {/* Sub-grid texture */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #103b2c 1px, transparent 1px), linear-gradient(to bottom, #103b2c 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            <div className="relative container mx-auto max-w-6xl px-4 pt-12 pb-14 md:pt-16 md:pb-20">
              {/* Top meta strip — publication-style */}
              <div className="flex flex-wrap items-center justify-between gap-y-2 border-b border-[#103b2c]/15 pb-3 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#103b2c]/55">
                <span className="text-[#0f6a52]">
                  <span className="inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-[#0f6a52] mr-1.5" />
                  {page.heroEyebrow}
                </span>
                <span>
                  Vol. 01 — Updated {formatDateMono(page.updatedAt)} · {page.readMinutes} min
                </span>
              </div>

              {/* Goal ticker — what this page covers, as a typographic data strip */}
              {goalsTicker && (
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[#0f6a52]/80">
                  {goalsTicker}
                </p>
              )}

              {/* H1 + dek */}
              <div className="mt-4 grid items-end gap-8 md:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                  <h1 className="font-extrabold leading-[0.98] tracking-[-0.035em] text-[42px] sm:text-[56px] md:text-[72px]">
                    {renderHeadlineWithAccent(page.h1)}
                  </h1>
                  <p className="mt-6 max-w-[600px] text-[17px] leading-[1.55] text-[#103b2c]/75 md:text-[18px]">
                    {page.heroSummary}
                  </p>
                </div>

                {/* Right-rail data card — broadsheet info box */}
                <aside className="md:justify-self-end">
                  <div className="rounded-none border border-[#103b2c]/15 bg-white/70 backdrop-blur-sm">
                    <div className="border-b border-[#103b2c]/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/55">
                      The brief
                    </div>
                    <dl className="divide-y divide-[#103b2c]/10">
                      <DataRow label="Audience" value={page.audience} />
                      <DataRow
                        label="Compounds"
                        value={`${recs.length} ${recs.length === 1 ? "pick" : "picks"}`}
                      />
                      <DataRow
                        label="By"
                        value={author?.name.replace("PeptidePros ", "") ?? "Editorial"}
                      />
                    </dl>
                  </div>
                </aside>
              </div>

              {/* Audience chips */}
              {page.audienceChips.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-[#103b2c]/10 pt-5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/45">
                    For:
                  </span>
                  {page.audienceChips.map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center rounded-full border border-[#103b2c]/20 px-2.5 py-0.5 text-[11.5px] font-medium text-[#103b2c]/85"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          <section className="border-b border-[#103b2c]/10 bg-[#fbfaf7]">
            <div className="container mx-auto max-w-6xl px-4 py-5">
              <EditorialTrustBlock review={editorialReview} />
            </div>
          </section>

          {gscUpgrade && <GscDemographicUpgrade upgrade={gscUpgrade} />}

          {/* ═══ Safety strip ═══════════════════════════════════════════ */}
          {page.safetyFlags.length > 0 && (
            <section
              aria-label="Safety considerations"
              className="border-b border-[#103b2c]/10 bg-[#f3efe6]"
            >
              <div className="container mx-auto max-w-6xl px-4 py-6">
                <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#103b2c]/55">
                  <span className="text-[#0f6a52]">§</span> Safety surface
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {page.safetyFlags.map((flag) => (
                    <SafetyFlagCard key={flag.label} flag={flag} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ═══ Body grid: main column + editorial TOC ═════════════════ */}
          <div className="container mx-auto max-w-6xl px-4 py-14 md:py-20">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
              {/* ─── Main column ─── */}
              <div className="min-w-0">
                {/* §01 — TL;DR pull-quote */}
                <Section number={1} id="tldr" title="Quick answer">
                  <blockquote className="border-l-[3px] border-l-[#0f6a52] pl-5">
                    <p className="text-[19px] leading-[1.55] text-[#103b2c] md:text-[20px]">
                      {page.tldr}
                    </p>
                  </blockquote>
                </Section>

                <div className="mt-10">
                  <IntentCtaPanel
                    eyebrow="Audience-specific next step"
                    title={`Match this ${page.audience.toLowerCase()} research to your profile.`}
                    body="Take the quiz before choosing a compound, vendor, or PDF so recommendations reflect your goals, life stage, and risk constraints."
                    secondaryHref="/peptides"
                    secondaryLabel="Browse peptides"
                    tertiaryHref="/vendors"
                    tertiaryLabel="Review vendors"
                  />
                </div>

                {/* §02 — Why this group */}
                <Section
                  number={2}
                  id="why-different"
                  title={`Why ${page.audience.toLowerCase()} need a different approach`}
                  kicker="The case"
                >
                  <p className="text-[16px] leading-[1.7] text-[#103b2c]/80">
                    {page.whyDifferent.intro}
                  </p>
                  <ul className="mt-6 grid gap-0 border-t border-[#103b2c]/10">
                    {page.whyDifferent.points.map((point, i) => (
                      <li
                        key={point}
                        className="grid grid-cols-[40px_1fr] gap-4 border-b border-[#103b2c]/10 py-4"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f6a52]">
                          0{i + 1}
                        </span>
                        <p className="text-[15px] leading-[1.65] text-[#103b2c]/85">
                          {point}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Section>

                {/* §03 — Compound cards (the centerpiece) */}
                {recs.length > 0 && (
                  <Section
                    number={3}
                    id="compounds"
                    title={
                      recs.length === 1
                        ? `The one compound for ${page.audience.toLowerCase()}`
                        : `The ${recs.length}-compound starter set for ${page.audience.toLowerCase()}`
                    }
                    kicker="The picks"
                  >
                    <p className="max-w-[640px] text-[14.5px] leading-[1.65] text-[#103b2c]/65">
                      One compound per priority goal — derived from the goal × age × sex
                      data layer, not from a top-ten list. Tier reflects evidence strength.
                    </p>
                    <ol className="mt-7 flex flex-col gap-5">
                      {recs.map((rec, i) => (
                        <CompoundCard
                          key={rec.peptide.id}
                          rec={rec}
                          index={i + 1}
                          total={recs.length}
                        />
                      ))}
                    </ol>
                  </Section>
                )}

                {/* Editorial body sections */}
                {page.bodySections.map((section, i) => (
                  <Section
                    key={section.id}
                    number={4 + i}
                    id={section.id}
                    title={section.title}
                    kicker={section.eyebrow}
                  >
                    <div className="flex flex-col gap-5">
                      {section.paragraphs.map((p, j) => (
                        <p
                          key={j}
                          className="text-[16px] leading-[1.75] text-[#103b2c]/85"
                        >
                          {p}
                        </p>
                      ))}
                      {section.bullets && (
                        <ul className="mt-2 grid gap-0 border-t border-[#103b2c]/10">
                          {section.bullets.map((b, j) => (
                            <li
                              key={b}
                              className="grid grid-cols-[40px_1fr] gap-4 border-b border-[#103b2c]/10 py-3.5"
                            >
                              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f6a52]/70">
                                0{j + 1}
                              </span>
                              <p className="text-[14.5px] leading-[1.65] text-[#103b2c]/85">
                                {b}
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </Section>
                )) }

                {/* FAQ */}
                {page.faqs.length > 0 && (
                  <Section
                    number={4 + page.bodySections.length}
                    id="faq"
                    title="Frequently asked questions"
                    kicker="FAQ"
                  >
                    <div className="divide-y divide-[#103b2c]/12 border-y border-[#103b2c]/12">
                      {page.faqs.map((faq, i) => (
                        <details
                          key={faq.question}
                          className="group py-5 [&_summary::-webkit-details-marker]:hidden"
                        >
                          <summary className="grid cursor-pointer list-none grid-cols-[44px_1fr_28px] items-start gap-4">
                            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#0f6a52]/80">
                              Q{String(i + 1).padStart(2, "0")}
                            </span>
                            <h3 className="m-0 text-[16px] font-semibold leading-[1.45] text-[#103b2c]">
                              {faq.question}
                            </h3>
                            <span
                              aria-hidden
                              className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#0f6a52]/30 text-[#0f6a52] transition-transform group-open:rotate-45"
                            >
                              <span className="text-[14px] leading-none">+</span>
                            </span>
                          </summary>
                          <div className="mt-3 grid grid-cols-[44px_1fr_28px] gap-4">
                            <span />
                            <p className="text-[14.5px] leading-[1.7] text-[#103b2c]/75">
                              {faq.answer}
                            </p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Footer CTA */}
                <section
                  id="protocol"
                  aria-label="Get your custom protocol"
                  className="mt-20 scroll-mt-24"
                >
                  <div className="relative overflow-hidden rounded-none bg-[#0c3226] p-8 text-white md:p-12">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-[0.06]"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #4ade80 1px, transparent 1px), linear-gradient(to bottom, #4ade80 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                      }}
                    />
                    <p className="relative font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/55">
                      <span className="text-[#4ade80]">§</span> Custom protocol
                    </p>
                    <h2 className="relative mt-3 max-w-[520px] text-[32px] font-extrabold leading-[1.05] tracking-[-0.025em] md:text-[42px]">
                      Get a protocol built for{" "}
                      <span className="italic text-[#4ade80]">you</span>, not for everyone.
                    </h2>
                    <p className="relative mt-4 max-w-[480px] text-[15px] leading-[1.65] text-white/70">
                      Six questions match compounds, dosing, stacking, and timing to your
                      goals, age, sex, and risk tolerance. Built in two minutes. Free.
                    </p>
                    <div className="relative mt-7 flex flex-wrap items-center gap-3">
                      <Link
                        href="/quiz"
                        className="inline-flex h-[52px] items-center gap-2 rounded-none bg-white px-7 text-[14.5px] font-extrabold uppercase tracking-[0.04em] text-[#103b2c] transition-transform hover:-translate-y-0.5"
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
                </section>

                {/* Sibling hub — broadsheet section listing */}
                <section id="siblings" className="mt-20 scroll-mt-24">
                  <header className="mb-6 flex items-end justify-between gap-4 border-b border-[#103b2c]/15 pb-3">
                    <div>
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#0f6a52]/80">
                        Section hub
                      </p>
                      <h2 className="mt-1 text-[24px] font-bold tracking-[-0.02em] text-[#103b2c] md:text-[28px]">
                        More from this section
                      </h2>
                    </div>
                    <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/45 sm:inline">
                      {page.siblings.length} guides
                    </span>
                  </header>
                  <ol className="divide-y divide-[#103b2c]/10 border-b border-[#103b2c]/10">
                    {page.siblings.map((s, i) => (
                      <li key={s.slug}>
                        <Link
                          href={`/blog/peptides-for/${s.slug}`}
                          className="group grid grid-cols-[44px_1fr_auto] items-center gap-4 py-4 transition-colors hover:bg-white"
                        >
                          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#0f6a52]/80">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0">
                            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/50">
                              {s.audience}
                            </p>
                            <p className="mt-0.5 text-[16px] font-semibold leading-[1.3] text-[#103b2c] transition-colors group-hover:text-[#0f6a52]">
                              {s.title}
                            </p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-[#103b2c]/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0f6a52]" />
                        </Link>
                      </li>
                    ))}
                  </ol>
                </section>

                {/* Author + disclaimer */}
                <footer className="mt-16 grid gap-8 border-t-2 border-[#103b2c] pt-8 md:grid-cols-[1fr_1fr]">
                  {author && (
                    <div>
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#0f6a52]">
                        Written by
                      </p>
                      <p className="mt-3 text-[18px] font-bold text-[#103b2c]">
                        {author.name}
                      </p>
                      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#103b2c]/55">
                        {author.credentials}
                      </p>
                      <p className="mt-3 text-[13.5px] leading-[1.65] text-[#103b2c]/70">
                        {author.bio}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-yellow-700">
                      Medical disclaimer
                    </p>
                    <p className="mt-3 text-[12.5px] leading-[1.65] text-[#103b2c]/65">
                      This guide is for educational purposes only and is not medical
                      advice. Many compounds discussed are research peptides not FDA-approved
                      for the uses described. Consult a licensed clinician before starting,
                      stopping, or combining any compound — especially if you are pregnant,
                      breastfeeding, have a history of cancer, or take prescription
                      medication.
                    </p>
                  </div>
                </footer>
                <div className="mt-8">
                  <SourceList sources={editorialReview.sources} />
                </div>
              </div>

              {/* ─── Editorial TOC ─── */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-5">
                  <StickyQuizCta />
                  <p className="mb-4 border-b border-[#103b2c]/15 pb-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#0f6a52]">
                    Contents
                  </p>
                  <nav aria-label="Table of contents">
                    <ol className="flex flex-col gap-0">
                      {sections.map((item, i) => (
                        <li key={item.id} className="border-b border-[#103b2c]/8 last:border-b-0">
                          <a
                            href={`#${item.id}`}
                            className="group grid grid-cols-[28px_1fr] items-baseline gap-2 py-2.5 transition-colors hover:text-[#0f6a52]"
                          >
                            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#0f6a52]/70">
                              §{String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="text-[12.5px] leading-[1.4] text-[#103b2c]/70 transition-colors group-hover:text-[#0f6a52]">
                              {item.label}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </div>
              </aside>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────────────

/**
 * Numbered editorial section — §01 prefix + kicker + H2 + body.
 * Adds the rhythm of a magazine spread without breaking the H2 hierarchy.
 */
function Section({
  number,
  id,
  title,
  kicker,
  children,
}: {
  number: number;
  id: string;
  title: string;
  kicker?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 first:mt-0 mt-20">
      <header className="mb-7">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[12px] font-bold uppercase tracking-[0.22em] text-[#0f6a52]">
            §{String(number).padStart(2, "0")}
          </span>
          {kicker && (
            <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#103b2c]/45">
              · {kicker}
            </span>
          )}
        </div>
        <h2 className="mt-3 text-[28px] font-bold leading-[1.15] tracking-[-0.025em] text-[#103b2c] md:text-[34px]">
          {title}
        </h2>
        <span className="mt-4 block h-px w-12 bg-[#0f6a52]" aria-hidden />
      </header>
      {children}
    </section>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[80px_1fr] items-baseline gap-3 px-5 py-3">
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#103b2c]/50">
        {label}
      </dt>
      <dd className="text-[13.5px] font-semibold text-[#103b2c]">{value}</dd>
    </div>
  );
}

function SafetyFlagCard({ flag }: { flag: DemographicSafetyFlag }) {
  const tone =
    flag.severity === "danger"
      ? {
          rule: "bg-red-600",
          label: "text-red-700",
          icon: <TriangleAlert className="h-3.5 w-3.5 text-red-600" />,
        }
      : flag.severity === "warning"
      ? {
          rule: "bg-yellow-600",
          label: "text-yellow-800",
          icon: <TriangleAlert className="h-3.5 w-3.5 text-yellow-700" />,
        }
      : {
          rule: "bg-[#0f6a52]",
          label: "text-[#0f6a52]",
          icon: <ShieldAlert className="h-3.5 w-3.5 text-[#0f6a52]" />,
        };

  return (
    <div className="relative bg-white pl-4 pr-4 py-3 ring-1 ring-[#103b2c]/10">
      <span className={`absolute left-0 top-0 h-full w-[3px] ${tone.rule}`} aria-hidden />
      <div className="flex items-center gap-2">
        {tone.icon}
        <p className={`text-[10.5px] font-semibold uppercase tracking-[0.14em] ${tone.label}`}>
          {flag.label}
        </p>
      </div>
      <p className="mt-1.5 text-[13px] leading-[1.55] text-[#103b2c]/75">{flag.detail}</p>
    </div>
  );
}

/**
 * Compound card — the visual centerpiece. Broadsheet entry style:
 * thick left-rule, oversized rank numeral, stock-ticker tier badge,
 * dose data row, dual vendor CTAs as inline pill buttons.
 */
function CompoundCard({
  rec,
  index,
  total,
}: {
  rec: DerivedPeptideRec;
  index: number;
  total: number;
}) {
  const { peptide } = rec;
  return (
    <li className="group relative bg-white ring-1 ring-[#103b2c]/12 transition-all hover:ring-[#0f6a52]/30 hover:shadow-[0_20px_60px_-32px_rgba(15,59,44,0.4)]">
      {/* Thick left rule — broadsheet anchor */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-1 bg-[#0f6a52] transition-all group-hover:w-1.5"
      />

      {/* Stock-ticker tier badge — top right corner */}
      <div className="absolute top-0 right-0 flex">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/45 px-3 py-1.5 border-l border-b border-[#103b2c]/10">
          {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span
          className={`inline-flex items-center font-mono text-[10.5px] font-bold tracking-[0.14em] px-3 py-1.5 border-b border-l border-[#103b2c]/10 ${tierColor(
            peptide.evidenceTier,
          )}`}
        >
          TIER {peptide.evidenceTier}
        </span>
      </div>

      <div className="grid gap-6 pl-7 pr-6 pt-12 pb-6 md:grid-cols-[1fr]">
        {/* Goal kicker */}
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#0f6a52]">
            For {rec.goalName.toLowerCase()}
          </p>

          {/* Compound name — the headline */}
          <h3 className="mt-2 text-[30px] font-extrabold leading-[1.05] tracking-[-0.025em] text-[#103b2c] md:text-[36px]">
            {peptide.name}
          </h3>

          {/* Synonym / risk strip */}
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {peptide.synonyms[0] && (
              <span className="text-[12.5px] italic text-[#103b2c]/55">
                aka {peptide.synonyms[0]}
              </span>
            )}
            <span
              className={`font-mono text-[10.5px] uppercase tracking-[0.18em] ${riskColor(
                peptide.riskLevel,
              )}`}
            >
              · {peptide.riskLevel.replace("-", " ")} risk
            </span>
          </div>

          {/* Framing */}
          <p className="mt-4 max-w-[640px] text-[15.5px] leading-[1.65] text-[#103b2c]/80">
            {rec.framing}
          </p>

          {/* Caution */}
          {rec.caution && (
            <div className="mt-4 flex items-start gap-2 border-l-[3px] border-l-yellow-600 bg-yellow-500/[0.05] px-3 py-2">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-yellow-700" />
              <p className="text-[12.5px] leading-[1.55] text-yellow-900/85">
                {rec.caution}
              </p>
            </div>
          )}
        </div>

        {/* Data row — dose, onset */}
        <dl className="grid grid-cols-2 gap-px border-t border-[#103b2c]/10 bg-[#103b2c]/10 sm:grid-cols-3">
          <div className="bg-white px-4 py-3">
            <dt className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[#103b2c]/50">
              Study dose
            </dt>
            <dd className="mt-1 text-[13px] font-semibold text-[#103b2c]">
              {peptide.studyDoseRange}
            </dd>
          </div>
          <div className="bg-white px-4 py-3">
            <dt className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[#103b2c]/50">
              Onset
            </dt>
            <dd className="mt-1 text-[13px] font-semibold text-[#103b2c]">
              {peptide.onsetTimeline}
            </dd>
          </div>
          <div className="bg-white px-4 py-3">
            <dt className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[#103b2c]/50">
              Category
            </dt>
            <dd className="mt-1 text-[13px] font-semibold capitalize text-[#103b2c]">
              {peptide.category.replace(/_/g, " ")}
            </dd>
          </div>
        </dl>

        {/* Action row */}
        <div className="flex flex-wrap items-center gap-2 border-t border-[#103b2c]/10 pt-5">
          <Link
            href={`/peptides/${peptide.slug}`}
            className="inline-flex h-10 items-center gap-2 border-[1.5px] border-[#103b2c] bg-transparent px-4 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-[#103b2c] transition-colors hover:bg-[#103b2c] hover:text-white"
          >
            Read the full guide
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </Link>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/40 sm:inline">
            or buy direct
          </span>
          {rec.vendorLinks.map((link) => (
            <a
              key={link.vendorId}
              href={link.url}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="inline-flex h-10 items-center gap-1.5 bg-[#0f6a52] px-4 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-white transition-all hover:-translate-y-px hover:bg-[#103b2c]"
            >
              {link.vendorName}
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </a>
          ))}
        </div>
      </div>
    </li>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────

function GscDemographicUpgrade({ upgrade }: { upgrade: GscUpgrade }) {
  return (
    <section className="border-b border-[#103b2c]/10 bg-white">
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-10">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-[#0f6a52]">
          Quick match
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <h2 className="text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-[#103b2c] md:text-[32px]">
              Start with the situation, not the compound.
            </h2>
            <p className="mt-3 text-[15.5px] leading-[1.75] text-[#103b2c]/78">
              {upgrade.answer}
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="border border-[#103b2c]/12 bg-[#fbfaf7] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0f6a52]">
                  Best fit
                </p>
                <p className="mt-2 text-[13.5px] leading-[1.65] text-[#103b2c]/74">
                  {upgrade.forText}
                </p>
              </div>
              <div className="border border-[#103b2c]/12 bg-[#fbfaf7] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#a16207]">
                  Avoid or delay
                </p>
                <p className="mt-2 text-[13.5px] leading-[1.65] text-[#103b2c]/74">
                  {upgrade.avoidText}
                </p>
              </div>
            </div>
          </div>
          <aside className="border border-[#103b2c]/12 bg-[#fbfaf7] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/50">
              Internal paths
            </p>
            <div className="mt-4 grid gap-2">
              {upgrade.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[13px] font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px] hover:text-[#0f6a52]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </aside>
        </div>
        <div className="mt-7 overflow-x-auto border-t border-[#103b2c]/12">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[#103b2c]/12">
                <th className="py-3 pr-4 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/45">
                  Situation
                </th>
                <th className="py-3 pr-4 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/45">
                  First compound
                </th>
                <th className="py-3 pr-4 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[#103b2c]/45">
                  Why
                </th>
              </tr>
            </thead>
            <tbody>
              {upgrade.situations.map((item) => (
                <tr key={item.situation} className="border-b border-[#103b2c]/10">
                  <td className="py-3 pr-4 text-[13.5px] font-semibold text-[#103b2c]">
                    {item.situation}
                  </td>
                  <td className="py-3 pr-4 text-[13.5px]">
                    <Link
                      href={item.href}
                      className="font-semibold text-[#103b2c] underline decoration-[#0f6a52] decoration-2 underline-offset-[5px]"
                    >
                      {item.compound}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-[13.5px] leading-[1.6] text-[#103b2c]/70">
                    {item.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function renderHeadlineWithAccent(h1: string) {
  // Italic-underline the audience descriptor in headlines like
  // "Peptides for Men Over 40" — accent on "Men Over 40".
  const match = h1.match(/^(Peptides\s+(?:for\s+|Postpartum\s*$))(.*)$/i);
  if (!match) {
    return <span>{h1}</span>;
  }
  const [, prefix, accent] = match;
  return (
    <>
      <span>{prefix.trim()}</span>{" "}
      <span className="relative inline-block italic text-[#0f6a52]">
        <span className="relative z-10">{accent.trim() || "Postpartum"}</span>
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-[6px] w-full bg-[#0f6a52]/15"
        />
      </span>
    </>
  );
}

function formatGoalLabel(goalId: string): string {
  return goalId
    .replace(/_/g, " ")
    .toUpperCase()
    .replace("GH OPTIMIZATION", "GH AXIS")
    .replace("SKIN HAIR", "SKIN")
    .replace("SEXUAL HEALTH", "LIBIDO")
    .replace("ANTI AGING", "LONGEVITY")
    .replace("MUSCLE GROWTH", "MUSCLE");
}

function formatDateMono(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d
    .toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}
